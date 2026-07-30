import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface IFixture {
  userId?: number;
  paymentSessionId?: number;
  outboxEventIds: number[];
}

async function createFixture(suffix: string): Promise<IFixture> {
  const scope = app.scope('a-pay');
  const user = await app.bean.user.register({ name: `pay-outbox-${suffix}` }, true);
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
  return { userId: user.id as number, paymentSessionId: session.id as number, outboxEventIds: [] };
}

async function insertOutbox(
  fixture: IFixture,
  overrides?: Partial<{
    eventType: string;
    state: 'pending' | 'claimed';
    attemptCount: number;
    nextAttemptAt: Date;
    claimToken: string;
    claimedAt: Date;
    claimExpiresAt: Date;
  }>,
) {
  const event = await app.scope('a-pay').model.outboxEvent.insert({
    eventType: overrides?.eventType ?? 'payment.outcome.v1',
    paymentSessionId: fixture.paymentSessionId!,
    payload: {},
    state: overrides?.state ?? 'pending',
    attemptCount: overrides?.attemptCount ?? 0,
    nextAttemptAt: overrides?.nextAttemptAt ?? new Date(Date.now() - 1_000),
    claimToken: overrides?.claimToken,
    claimedAt: overrides?.claimedAt,
    claimExpiresAt: overrides?.claimExpiresAt,
  });
  fixture.outboxEventIds.push(event.id as number);
  return event;
}

async function cleanup(fixture: IFixture) {
  const scope = app.scope('a-pay');
  for (const id of fixture.outboxEventIds) await scope.model.outboxEvent.delete({ id });
  if (fixture.paymentSessionId !== undefined) {
    await scope.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.webhookInbox.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.paymentSession.delete({ id: fixture.paymentSessionId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

describe('outbox.test.ts', { concurrency: false }, () => {
  it('claims, backs off, and exhausts durable delivery attempts', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(randomUUID().slice(0, 12));
      try {
        const event = await insertOutbox(fixture);
        const scope = app.scope('a-pay');
        const first = await scope.service.outbox.claim(event.id);
        assert.equal(first?.attemptCount, 1);
        assert.ok(first?.claimToken);
        const releaseStart = Date.now();
        await scope.service.outbox.release(
          event.id,
          first!.claimToken!,
          new Error('first failure'),
        );
        let persisted = await scope.model.outboxEvent.getById(event.id);
        assert.equal(persisted?.state, 'pending');
        assert.equal(persisted?.errorSummary, 'first failure');
        assert.ok((persisted?.nextAttemptAt?.getTime() ?? 0) >= releaseStart + 900);
        assert.equal(await scope.service.outbox.claim(event.id), undefined);
        await scope.model.outboxEvent.updateById(event.id, {
          nextAttemptAt: new Date(Date.now() - 1),
        });
        const second = await scope.service.outbox.claim(event.id);
        assert.equal(second?.attemptCount, 2);
        const secondReleaseStart = Date.now();
        await scope.service.outbox.release(
          event.id,
          second!.claimToken!,
          new Error('second failure'),
        );
        persisted = await scope.model.outboxEvent.getById(event.id);
        assert.ok((persisted?.nextAttemptAt?.getTime() ?? 0) >= secondReleaseStart + 1_900);

        const exhausted = await insertOutbox(fixture, { attemptCount: 10 });
        assert.equal(await scope.service.outbox.claim(exhausted.id), undefined);
        assert.equal((await scope.model.outboxEvent.getById(exhausted.id))?.state, 'failed');
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('reclaims expired leases and fences stale claim tokens', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(randomUUID().slice(0, 12));
      try {
        const event = await insertOutbox(fixture);
        const scope = app.scope('a-pay');
        const first = await scope.service.outbox.claim(event.id);
        await scope.model.outboxEvent.updateById(event.id, {
          claimExpiresAt: new Date(Date.now() - 1),
        });
        const second = await scope.service.outbox.claim(event.id);
        assert.ok(second?.claimToken);
        assert.notEqual(second?.claimToken, first?.claimToken);
        assert.equal(second?.attemptCount, 2);
        assert.equal(
          await scope.service.outbox.markDispatched(event.id, first!.claimToken!),
          undefined,
        );
        assert.equal(
          await scope.service.outbox.release(event.id, first!.claimToken!, new Error('stale')),
          undefined,
        );
        assert.equal(
          (await scope.model.outboxEvent.getById(event.id))?.claimToken,
          second?.claimToken,
        );
        await scope.service.outbox.markDispatched(event.id, second!.claimToken!);
        const persisted = await scope.model.outboxEvent.getById(event.id);
        assert.equal(persisted?.state, 'dispatched');
        assert.equal(persisted?.claimToken, undefined);
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('rolls back enqueued durable rows with the enclosing transaction', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(randomUUID().slice(0, 12));
      try {
        const scope = app.scope('a-pay');
        const eventId = await assert.rejects(
          app.ctx.db.transaction.begin(async () => {
            const event = await scope.service.outbox.enqueue(
              fixture.paymentSessionId!,
              'payment.outcome.v1',
              { test: true },
            );
            fixture.outboxEventIds.push(event.id as number);
            throw new Error(String(event.id));
          }),
          /\d+/,
        );
        assert.equal(eventId, undefined);
        const events = await scope.model.outboxEvent.select({
          where: { paymentSessionId: fixture.paymentSessionId },
        });
        assert.deepEqual(events, []);
        fixture.outboxEventIds = [];
      } finally {
        await cleanup(fixture);
      }
    });
  });
});
