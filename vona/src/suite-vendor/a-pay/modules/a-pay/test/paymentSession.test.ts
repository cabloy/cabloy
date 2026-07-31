import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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
    payScene: 'test-payment',
    businessReference: `business-${suffix}`,
    providerName: 'pay-mock:mock',
    clientName: 'default',
    environment: 'sandbox',
    amountMinor: 1299,
    currency: 'USD',
    correlationId: `payment-${suffix}`,
    expiresAt,
  });
  return { userId: user.id as number, paymentSessionId: session.id as number };
}

async function cleanup(fixture: IFixture) {
  const scope = app.scope('a-pay');
  if (fixture.paymentSessionId !== undefined) {
    await scope.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
    await scope.model.paymentSession.delete({ id: fixture.paymentSessionId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

describe('paymentSession.test.ts', { concurrency: false }, () => {
  it('starts only an unexpired created payment session', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        const session = await scope.service.paymentSession.start(fixture.paymentSessionId!);
        assert.equal(session.state, 'requires_action');
        await assert.rejects(scope.service.paymentSession.start(fixture.paymentSessionId!), {
          status: 409,
        });
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('does not start an expired payment session', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() - 1));
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
      assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
      assert.equal(results.filter(result => result.status === 'rejected').length, 1);
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });
});
