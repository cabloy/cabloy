import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  userId?: number;
  paymentSessionId?: number;
}

async function createFixture(suffix: string): Promise<IFixture> {
  const user = await app.bean.user.register({ name: `pay-mock-${suffix}` }, true);
  await app.bean.passport.signinMock(`pay-mock-${suffix}` as any);
  const session = await app.scope('a-pay').service.paymentSession.create({
    userId: user.id,
    payScene: 'commerce-payment:commerceOrder',
    businessReference: `business-${suffix}`,
    amountMinor: 1299,
    currency: 'USD',
    correlationId: `payment-${suffix}`,
  });
  await app.scope('a-pay').service.paymentSession.start(session.id);
  return { userId: user.id as number, paymentSessionId: session.id as number };
}

async function cleanup(fixture: IFixture) {
  const pay = app.scope('a-pay');
  if (fixture.paymentSessionId !== undefined) {
    await pay.model.outboxEvent.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.webhookInbox.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.paymentSession.delete({ id: fixture.paymentSessionId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
  await app.bean.passport.signout();
}

describe('payMock.test.ts', { concurrency: false }, () => {
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

  it('submits server-derived mock payment facts through the signed webhook', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createFixture('success'));
        const receipt = await app
          .scope('pay-mock')
          .service.payMock.completePaymentSession(fixture.paymentSessionId!, 'succeeded');
        assert.deepEqual(receipt, { paymentSessionId: fixture.paymentSessionId, accepted: true });
        const pay = app.scope('a-pay');
        const [session, inboxes, audits, outbox] = await Promise.all([
          pay.model.paymentSession.getById(fixture.paymentSessionId!),
          pay.model.webhookInbox.select({ where: { paymentSessionId: fixture.paymentSessionId } }),
          pay.model.paymentAudit.select({ where: { paymentSessionId: fixture.paymentSessionId } }),
          pay.model.outboxEvent.select({ where: { paymentSessionId: fixture.paymentSessionId } }),
        ]);
        assert.equal(session?.state, 'succeeded');
        assert.equal(inboxes.length, 1);
        assert.equal(audits.filter(item => item.source === 'webhook').length, 1);
        assert.equal(outbox.length, 1);
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('does not simulate a session that is no longer actionable', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createFixture('terminal'));
        await app
          .scope('pay-mock')
          .service.payMock.completePaymentSession(fixture.paymentSessionId!, 'cancelled');
        await assert.rejects(
          app
            .scope('pay-mock')
            .service.payMock.completePaymentSession(fixture.paymentSessionId!, 'cancelled'),
          { status: 409 },
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });
});
