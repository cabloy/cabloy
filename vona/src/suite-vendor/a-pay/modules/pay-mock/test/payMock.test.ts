import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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
  it('captures Vona env secrets in the mock Provider options', () => {
    const options = app.bean.payProvider.getOptions('pay-mock:mock', 'default');
    assert.equal(options.secretCredential, app.meta.env.PAY_MOCK_DEFAULT_CREDENTIAL);
    assert.equal(options.secretWebhook, app.meta.env.PAY_MOCK_DEFAULT_WEBHOOK);
    assert.equal(String(options.secretCredential).startsWith('env:' + '//'), false);
    assert.equal(String(options.secretWebhook).startsWith('env:' + '//'), false);
    assert.deepEqual(options.capabilities, {
      redirectCheckout: false,
      embeddedCheckout: true,
      automaticCapture: true,
      manualCapture: false,
      refunds: true,
      partialRefunds: true,
      webhooks: true,
    });
    assert.deepEqual(
      app.bean.payProvider.resolveByName('pay-mock:mock', 'secondary').clientOptions.capabilities,
      options.capabilities,
    );
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
