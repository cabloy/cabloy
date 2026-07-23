import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('paymentAttempt.test.ts', { concurrency: false }, () => {
  it('creates and internally cancels an attempt exactly once', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('commerce-payment');
      const suffix = randomUUID().slice(0, 12);
      let attemptId: number | undefined;
      try {
        const user = await app.bean.user.register({ name: `payment-${suffix}` }, true);
        const created = await scope.service.paymentAttempt.create({
          orderId: 900_001,
          userId: user.id,
          currency: 'USD',
          amountCents: 1299,
          correlationId: `payment-${suffix}`,
        });
        attemptId = created.id as number;
        assert.equal(created.state, 'created');
        const cancelled = await scope.service.paymentAttempt.cancel(created.orderId);
        assert.equal(cancelled?.state, 'cancelled');
        const replay = await scope.service.paymentAttempt.cancel(created.orderId);
        assert.equal(replay?.id, created.id);
        assert.equal(replay?.state, 'cancelled');
      } finally {
        if (attemptId !== undefined) await scope.model.paymentAttempt.delete({ id: attemptId });
      }
    });
  });
});
