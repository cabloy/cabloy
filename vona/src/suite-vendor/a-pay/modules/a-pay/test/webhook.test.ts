import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('webhook.test.ts', { concurrency: false }, () => {
  it('persists one verified payment fact and one logical outbox event across replay', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('a-pay');
      const suffix = randomUUID().slice(0, 12);
      let userId: number | undefined;
      let paymentSessionId: number | undefined;
      try {
        const user = await app.bean.user.register({ name: `pay-webhook-${suffix}` }, true);
        userId = user.id as number;
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
        paymentSessionId = session.id as number;
        const command = {
          providerName: 'pay-mock:mock',
          clientName: 'default',
          environment: 'sandbox' as const,
          rawBody: `{"eventId":"mock-${suffix}"}`,
          verified: {
            eventId: `mock-${suffix}`,
            eventType: 'payment.succeeded',
            paymentSessionId: session.id,
            payment: {
              state: 'succeeded' as const,
              providerPaymentId: `payment-${suffix}`,
              providerCaptureId: `capture-${suffix}`,
            },
            summary: {
              amountMinor: 1299,
              currency: 'USD',
            },
          },
        };
        const first = await scope.service.webhook.receive(command);
        const replay = await scope.service.webhook.receive(command);
        assert.equal(replay.id, first.id);
        assert.equal(replay.state, 'processed');
        const sessionAfter = await scope.model.paymentSession.getById(session.id);
        const inboxes = await scope.model.webhookInbox.select({
          where: { paymentSessionId: session.id },
        });
        const audits = await scope.model.paymentAudit.select({
          where: { paymentSessionId: session.id },
        });
        const outbox = await scope.model.outboxEvent.select({
          where: { paymentSessionId: session.id },
        });
        assert.equal(sessionAfter?.state, 'succeeded');
        assert.equal(inboxes.length, 1);
        assert.equal(audits.length, 1);
        assert.equal(outbox.length, 1);
        assert.equal(outbox[0]?.eventType, 'payment.outcome.v1');
      } finally {
        if (paymentSessionId !== undefined) {
          await scope.model.outboxEvent.delete({ paymentSessionId });
          await scope.model.paymentAudit.delete({ paymentSessionId });
          await scope.model.webhookInbox.delete({ paymentSessionId });
          await scope.model.paymentSession.delete({ id: paymentSessionId });
        }
        if (userId !== undefined) {
          await app.scope('home-user').model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
      }
    });
  });
});
