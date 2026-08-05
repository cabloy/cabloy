import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  userId?: number;
  paymentSessionId?: number;
}

async function createFixture(expiresAt: Date): Promise<IFixture> {
  const scope = app.scope('a-pay');
  const suffix = randomUUID().slice(0, 12);
  const user = await app.bean.user.register({ name: `payment-session-${suffix}` }, true);
  const session = await scope.service.paymentSession.create({
    userId: user.id,
    payScene: 'commerce-payment:commerceOrder',
    businessReference: `business-${suffix}`,
    amountMinor: 1299,
    currency: 'USD',
    correlationId: `payment-${suffix}`,
  });
  await scope.model.paymentSession.updateById(session.id, { expiresAt });
  return { userId: user.id as number, paymentSessionId: session.id as number };
}

async function cleanup(fixture: IFixture) {
  const scope = app.scope('a-pay');
  if (fixture.paymentSessionId !== undefined) {
    await scope.model.outboxEvent.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.webhookInbox.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.providerOperation.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.refundOperation.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.paymentSession.delete({ id: fixture.paymentSessionId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

describe('paymentSession.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-pay');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('derives provider facts and expiry from the payment scene', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('a-pay');
      const suffix = randomUUID().slice(0, 12);
      const user = await app.bean.user.register({ name: `payment-session-${suffix}` }, true);
      const fixture: IFixture = { userId: user.id as number };
      try {
        const createdAt = Date.now();
        const session = await scope.service.paymentSession.create({
          userId: user.id,
          payScene: 'commerce-payment:commerceOrder',
          businessReference: `business-${suffix}`,
          amountMinor: 1299,
          currency: 'USD',
          correlationId: `payment-${suffix}`,
        });
        fixture.paymentSessionId = session.id as number;
        assert.equal(session.providerName, 'pay-mock:mock');
        assert.equal(session.clientName, 'default');
        assert.equal(session.environment, 'sandbox');
        assert.ok(session.expiresAt.getTime() >= createdAt + 30 * 60 * 1000);
        assert.ok(session.expiresAt.getTime() <= Date.now() + 30 * 60 * 1000);
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('rejects an unavailable provider candidate instead of falling back', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('a-pay');
      const suffix = randomUUID().slice(0, 12);
      const user = await app.bean.user.register({ name: `payment-candidate-${suffix}` }, true);
      const fixture: IFixture = { userId: user.id as number };
      try {
        await assert.rejects(
          scope.service.paymentSession.create({
            userId: user.id,
            payScene: 'commerce-payment:commerceOrder',
            businessReference: `business-${suffix}`,
            amountMinor: 1299,
            currency: 'USD',
            correlationId: `payment-${suffix}`,
            providerCandidateKey: 'paypal',
          }),
          { status: 422 },
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('rejects a currency outside the payment scene policy', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('a-pay');
      const suffix = randomUUID().slice(0, 12);
      const user = await app.bean.user.register({ name: `payment-session-${suffix}` }, true);
      const fixture: IFixture = { userId: user.id as number };
      try {
        await assert.rejects(
          scope.service.paymentSession.create({
            userId: user.id,
            payScene: 'commerce-payment:commerceOrder',
            businessReference: `business-${suffix}`,
            amountMinor: 1299,
            currency: 'EUR',
            correlationId: `payment-${suffix}`,
          }),
          { status: 422 },
        );
        assert.deepEqual(
          await scope.model.paymentSession.select({
            where: { correlationId: `payment-${suffix}` },
          }),
          [],
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('starts only an unexpired created payment session', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        const session = await scope.service.paymentSession.start(fixture.paymentSessionId!);
        assert.equal(session.state, 'requires_action');
        const replayed = await scope.service.paymentSession.start(fixture.paymentSessionId!);
        assert.equal(replayed.state, 'requires_action');
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('does not start an expired payment session', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() - 1_000));
      try {
        const scope = app.scope('a-pay');
        await assert.rejects(scope.service.paymentSession.start(fixture.paymentSessionId!), {
          status: 409,
        });
        assert.equal(
          (await scope.model.paymentSession.getById(fixture.paymentSessionId!))?.state,
          'created',
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('allows only one competing start to call the provider', async () => {
    const fixture = await app.bean.executor.mockCtx(async () => {
      return await createFixture(new Date(Date.now() + 60_000));
    });
    try {
      const results = await Promise.allSettled([
        app.bean.executor.mockCtx(async () => {
          return await app.scope('a-pay').service.paymentSession.start(fixture.paymentSessionId!);
        }),
        app.bean.executor.mockCtx(async () => {
          return await app.scope('a-pay').service.paymentSession.start(fixture.paymentSessionId!);
        }),
      ]);
      assert.equal(results.filter(result => result.status === 'fulfilled').length, 2);
      const operations = await app.bean.executor.mockCtx(async () => {
        return await app.scope('a-pay').model.providerOperation.select({
          where: { paymentSessionId: fixture.paymentSessionId, kind: 'start' },
        });
      });
      assert.equal(operations.length, 1);
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });
});
