import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

describe('paymentAttempt.test.ts', { concurrency: false }, () => {
  const releaseTestLocks: Array<() => void> = [];

  before(async () => {
    try {
      for (const scene of ['a-commerce', 'a-pay']) {
        releaseTestLocks.push(await acquireTestLock(scene));
      }
    } catch (error) {
      for (const release of releaseTestLocks.reverse()) release();
      throw error;
    }
  });

  after(() => {
    for (const release of releaseTestLocks.reverse()) release();
  });

  it('creates and internally cancels an attempt exactly once', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('commerce-payment');
      const suffix = randomUUID().slice(0, 12);
      let attemptId: number | undefined;
      let paymentSessionId: number | undefined;
      let userId: number | undefined;
      try {
        const user = await app.bean.user.register({ name: `payment-${suffix}` }, true);
        userId = user.id as number;
        const created = await scope.service.paymentAttempt.create({
          orderId: 900_001,
          userId: user.id,
          currency: 'USD',
          amountCents: 1299,
          correlationId: `payment-${suffix}`,
        });
        attemptId = created.id as number;
        paymentSessionId = created.paymentSessionId as number;
        assert.equal(created.state, 'created');
        const session = await app.scope('a-pay').model.paymentSession.getById(paymentSessionId);
        assert.ok(session);
        assert.equal(session.payScene, 'commerce-payment:commerceOrder');
        assert.equal(session.providerName, 'pay-mock:mock');
        const payScene = app.bean.payScene.get('commerce-payment:commerceOrder');
        assert.equal(
          await payScene.getPaymentCallbackPath(session),
          `/commerce/commerce/trade/payment/${paymentSessionId}/${created.orderId}`,
        );
        assert.equal(session?.clientName, 'default');
        assert.equal(session?.environment, 'sandbox');
        assert.match(
          session?.providerInvoiceReference ?? '',
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        assert.match(
          session?.providerCorrelationReference ?? '',
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        assert.notEqual(session?.providerInvoiceReference, session?.providerCorrelationReference);
        const reloaded = await app.scope('a-pay').model.paymentSession.getById(paymentSessionId);
        assert.equal(reloaded?.providerInvoiceReference, session?.providerInvoiceReference);
        assert.equal(reloaded?.providerCorrelationReference, session?.providerCorrelationReference);
        assert.ok((session?.expiresAt.getTime() ?? 0) > Date.now() + 29 * 60 * 1000);
        const cancelled = await scope.service.paymentAttempt.cancel(created.orderId);
        assert.equal(cancelled?.state, 'cancelled');
        const replay = await scope.service.paymentAttempt.cancel(created.orderId);
        assert.equal(replay?.id, created.id);
        assert.equal(replay?.state, 'cancelled');
      } finally {
        if (paymentSessionId !== undefined) {
          const pay = app.scope('a-pay');
          await pay.model.outboxEvent.delete({ paymentSessionId });
          await pay.model.paymentAudit.delete({ paymentSessionId });
          await pay.model.webhookInbox.delete({ paymentSessionId });
          await pay.model.paymentSession.delete({ id: paymentSessionId });
        }
        if (attemptId !== undefined) await scope.model.paymentAttempt.delete({ id: attemptId });
        if (userId !== undefined) {
          await app.scope('home-user').model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
      }
    });
  });
});
