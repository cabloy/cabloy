import assert from 'node:assert';
import { createHmac, randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  userId?: number;
  paymentSessionId?: number;
}

async function createFixture(suffix: string): Promise<IFixture> {
  const scope = app.scope('a-pay');
  const user = await app.bean.user.register({ name: `pay-webhook-${suffix}` }, true);
  const session = await scope.service.paymentSession.create({
    userId: user.id,
    payScene: 'test-payment',
    businessReference: `business-${suffix}`,
    providerName: 'pay-mock:mock',
    clientName: 'default',
    environment: 'sandbox',
    amountMinor: 1299,
    currency: 'USD',
    correlationId: `payment-${suffix}`,
    expiresAt: new Date(Date.now() + 60_000),
  });
  return { userId: user.id as number, paymentSessionId: session.id as number };
}

async function cleanup(fixture: IFixture) {
  const scope = app.scope('a-pay');
  if (fixture.paymentSessionId !== undefined) {
    await scope.model.outboxEvent.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.webhookInbox.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.paymentSession.delete({ id: fixture.paymentSessionId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

function createRawBody(
  fixture: IFixture,
  suffix: string,
  state: 'succeeded' | 'failed' | 'cancelled' = 'succeeded',
  options?: { eventId?: string; providerPaymentId?: string; providerCaptureId?: string },
) {
  return JSON.stringify({
    state,
    amountMinor: 1299,
    eventType: `payment.${state}`,
    paymentSessionId: String(fixture.paymentSessionId),
    eventId: options?.eventId ?? `mock-${suffix}`,
    providerPaymentId: options?.providerPaymentId ?? `payment-${suffix}`,
    providerCaptureId: options?.providerCaptureId ?? `capture-${suffix}`,
    currency: 'USD',
  });
}

function createCommand(rawBody: string) {
  const body = JSON.parse(rawBody);
  return {
    providerName: 'pay-mock:mock',
    clientName: 'default',
    environment: 'sandbox' as const,
    rawBody,
    verified: {
      eventId: body.eventId,
      eventType: body.eventType,
      paymentSessionId: body.paymentSessionId,
      payment: {
        state: body.state,
        providerPaymentId: body.providerPaymentId,
        providerCaptureId: body.providerCaptureId,
      },
      summary: {
        amountMinor: body.amountMinor,
        currency: body.currency,
      },
    },
  };
}

function sign(rawBody: string) {
  return createHmac('sha256', process.env.PAY_MOCK_WEBHOOK_SECRET!).update(rawBody).digest('hex');
}

function webhookUrl() {
  const url = app.util.getAbsoluteUrlByApiPath('/pay/webhook/mock');
  return url.startsWith('http') ? url : `http://127.0.0.1:${app.config.server.listen.port}${url}`;
}

async function countFacts(paymentSessionId: number) {
  const scope = app.scope('a-pay');
  const [inboxes, audits, outbox] = await Promise.all([
    scope.model.webhookInbox.select({ where: { paymentSessionId } }),
    scope.model.paymentAudit.select({ where: { paymentSessionId } }),
    scope.model.outboxEvent.select({ where: { paymentSessionId } }),
  ]);
  return { inboxes, audits, outbox };
}

describe('webhook.test.ts', { concurrency: false, sequential: true }, () => {
  let releaseTestLock: (() => void) | undefined;
  let previousWebhookSecret: string | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('payment-webhook-secret');
    previousWebhookSecret = process.env.PAY_MOCK_WEBHOOK_SECRET;
    process.env.PAY_MOCK_WEBHOOK_SECRET = 'pay-mock-test-secret';
  });

  after(() => {
    if (previousWebhookSecret === undefined) delete process.env.PAY_MOCK_WEBHOOK_SECRET;
    else process.env.PAY_MOCK_WEBHOOK_SECRET = previousWebhookSecret;
    releaseTestLock?.();
  });

  it('accepts a raw-body signed HTTP webhook and rejects an invalid signature without mutation', async () => {
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createFixture(randomUUID().slice(0, 12)));
      });
      const rawBody = createRawBody(fixture, randomUUID().slice(0, 12));
      const url = webhookUrl();
      const invalid = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pay-mock-signature': 'invalid',
        },
        body: rawBody,
      });
      assert.equal(invalid.status, 401, await invalid.text());
      await app.bean.executor.mockCtx(async () => {
        assert.deepEqual(await countFacts(fixture.paymentSessionId!), {
          inboxes: [],
          audits: [],
          outbox: [],
        });
      });
      const valid = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pay-mock-signature': sign(rawBody),
        },
        body: rawBody,
      });
      assert.equal(valid.status, 200);
      await app.bean.executor.mockCtx(async () => {
        const session = await app
          .scope('a-pay')
          .model.paymentSession.getById(fixture.paymentSessionId!);
        const facts = await countFacts(fixture.paymentSessionId!);
        assert.equal(session?.state, 'succeeded');
        assert.deepEqual(
          [facts.inboxes.length, facts.audits.length, facts.outbox.length],
          [1, 1, 1],
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await cleanup(fixture));
    }
  });

  it('persists one verified payment fact and one logical outbox event across replay', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(randomUUID().slice(0, 12));
      try {
        const rawBody = createRawBody(fixture, randomUUID().slice(0, 12));
        const first = await app.scope('a-pay').service.webhook.receive(createCommand(rawBody));
        const replay = await app.scope('a-pay').service.webhook.receive(createCommand(rawBody));
        assert.equal(replay.id, first.id);
        assert.equal(replay.state, 'processed');
        const session = await app
          .scope('a-pay')
          .model.paymentSession.getById(fixture.paymentSessionId!);
        const facts = await countFacts(fixture.paymentSessionId!);
        assert.equal(session?.state, 'succeeded');
        assert.deepEqual(
          [facts.inboxes.length, facts.audits.length, facts.outbox.length],
          [1, 1, 1],
        );
        assert.equal(facts.outbox[0]?.eventType, 'payment.outcome.v1');
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('converges concurrent duplicate and out-of-order terminal webhooks on the first terminal state', async () => {
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createFixture(randomUUID().slice(0, 12)));
      });
      const rawBody = createRawBody(fixture, randomUUID().slice(0, 12));
      const receive = async () => {
        return await app.bean.executor.mockCtx(async () => {
          return await app.scope('a-pay').service.webhook.receive(createCommand(rawBody));
        });
      };
      const results = await Promise.allSettled([receive(), receive()]);
      assert.equal(
        results.filter(result => result.status === 'fulfilled').length,
        2,
        JSON.stringify(results),
      );
      await app.bean.executor.mockCtx(async () => {
        const failedRawBody = createRawBody(fixture, randomUUID().slice(0, 12), 'failed');
        const ignored = await app
          .scope('a-pay')
          .service.webhook.receive(createCommand(failedRawBody));
        const session = await app
          .scope('a-pay')
          .model.paymentSession.getById(fixture.paymentSessionId!);
        const facts = await countFacts(fixture.paymentSessionId!);
        assert.equal(session?.state, 'succeeded');
        assert.equal(ignored.state, 'processed');
        assert.match(ignored.errorSummary ?? '', /ignored after succeeded/);
        assert.deepEqual(
          [facts.inboxes.length, facts.audits.length, facts.outbox.length],
          [2, 1, 1],
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await cleanup(fixture));
    }
  });

  it('rejects a same-state webhook with conflicting provider facts', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(randomUUID().slice(0, 12));
      try {
        const first = createRawBody(fixture, randomUUID().slice(0, 12));
        await app.scope('a-pay').service.webhook.receive(createCommand(first));
        const conflict = createRawBody(fixture, randomUUID().slice(0, 12), 'succeeded', {
          providerCaptureId: `other-capture-${randomUUID().slice(0, 12)}`,
        });
        await assert.rejects(
          app.scope('a-pay').service.webhook.receive(createCommand(conflict)),
          (error: any) => error.code === 409,
        );
        const facts = await countFacts(fixture.paymentSessionId!);
        assert.deepEqual(
          [facts.inboxes.length, facts.audits.length, facts.outbox.length],
          [1, 1, 1],
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });
});
