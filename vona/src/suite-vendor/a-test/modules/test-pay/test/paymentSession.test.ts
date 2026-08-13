import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  userId?: number;
  paymentSessionId?: number;
}

function isZodCustomError(error: unknown, path: string[], message: string) {
  assert.equal((error as any).code, 422);
  assert.deepEqual((error as any).message, [
    {
      code: 'custom',
      path,
      message,
    },
  ]);
  return true;
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
    const refunds = await scope.model.refundOperation.select({
      where: { paymentSessionId: fixture.paymentSessionId },
    });
    for (const refund of refunds) {
      const providerOperation = await scope.model.providerOperation.get({
        refundOperationId: refund.id,
        kind: 'refund',
      });
      if (providerOperation) {
        await scope.model.providerOperationRecoveryAudit.delete({
          providerOperationId: providerOperation.id,
        });
      }
    }
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
        assert.match(
          session.providerInvoiceReference,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        assert.match(
          session.providerCorrelationReference,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        assert.notEqual(session.providerInvoiceReference, session.providerCorrelationReference);
        const reloaded = await scope.model.paymentSession.getById(session.id);
        assert.equal(reloaded?.providerInvoiceReference, session.providerInvoiceReference);
        assert.equal(reloaded?.providerCorrelationReference, session.providerCorrelationReference);
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
            providerCandidateKey: 'unavailable-provider',
          }),
          error =>
            isZodCustomError(
              error,
              ['providerCandidateKey'],
              'payment provider candidate is unavailable',
            ),
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
          error =>
            isZodCustomError(
              error,
              ['currency'],
              'payment currency is not allowed by the payment scene',
            ),
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

  it('reports an invalid payment amount as a field error', async () => {
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
            amountMinor: -1,
            currency: 'USD',
            correlationId: `payment-${suffix}`,
          }),
          error => isZodCustomError(error, ['amountMinor'], 'payment amount is invalid'),
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

  it('returns a terminal payment session when confirmation is replayed', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        await scope.model.paymentSession.updateById(fixture.paymentSessionId!, {
          state: 'succeeded',
          finalizedAt: new Date(),
        });
        const session = await scope.service.providerOperation.confirm(fixture.paymentSessionId!);
        assert.equal(session.state, 'succeeded');
        assert.deepEqual(
          await scope.model.providerOperation.select({
            where: { paymentSessionId: fixture.paymentSessionId!, kind: 'confirm' },
          }),
          [],
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('rejects refund commands that conflict with the payment state', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        await scope.model.paymentSession.updateById(fixture.paymentSessionId!, {
          state: 'succeeded',
          providerCaptureId: `capture-${randomUUID().slice(0, 12)}`,
          finalizedAt: new Date(),
        });
        const command = {
          paymentSessionId: fixture.paymentSessionId!,
          businessReference: `refund-${randomUUID().slice(0, 12)}`,
          currency: 'USD',
          idempotencyKey: `refund-${randomUUID()}`,
          correlationId: `refund-${randomUUID()}`,
        };
        await assert.rejects(scope.service.refundOperation.create({ ...command, amountMinor: 0 }), {
          code: 409,
          status: 409,
        });
        assert.deepEqual(
          await scope.model.refundOperation.select({
            where: { paymentSessionId: fixture.paymentSessionId! },
          }),
          [],
        );
        await scope.service.refundOperation.create({ ...command, amountMinor: 1_000 });
        await assert.rejects(
          scope.service.refundOperation.create({
            ...command,
            amountMinor: 300,
            businessReference: `refund-${randomUUID().slice(0, 12)}`,
            idempotencyKey: `refund-${randomUUID()}`,
            correlationId: `refund-${randomUUID()}`,
          }),
          { code: 409, status: 409 },
        );
        assert.equal(
          (
            await scope.model.refundOperation.select({
              where: { paymentSessionId: fixture.paymentSessionId! },
            })
          ).length,
          1,
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('schedules a pending refund for durable reconciliation', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        await scope.model.paymentSession.updateById(fixture.paymentSessionId!, {
          state: 'succeeded',
          providerCaptureId: `capture-${randomUUID().slice(0, 12)}`,
          finalizedAt: new Date(),
        });
        const refund = await scope.service.refundOperation.create({
          paymentSessionId: fixture.paymentSessionId!,
          businessReference: `refund-${randomUUID().slice(0, 12)}`,
          amountMinor: 1299,
          currency: 'USD',
          idempotencyKey: `refund-${randomUUID()}`,
          correlationId: `refund-${randomUUID()}`,
        });
        const providerOperation = await scope.model.providerOperation.get({
          refundOperationId: refund.id,
          kind: 'refund',
        });
        assert.ok(providerOperation);
        assert.match(
          refund.providerInvoiceReference,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        assert.match(
          refund.providerCorrelationReference,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        assert.notEqual(refund.providerInvoiceReference, refund.providerCorrelationReference);
        assert.match(
          providerOperation.idempotencyKey,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        const claimed = await scope.service.providerOperation.claim(providerOperation.id);
        assert.ok(claimed?.claimToken);
        await scope.service.providerOperation.markSubmitted(
          providerOperation.id,
          claimed.claimToken,
        );
        await scope.service.refundOperation.settleProviderSnapshot(
          providerOperation.id,
          claimed.claimToken,
          { state: 'pending', providerRefundId: `refund-${randomUUID().slice(0, 12)}` },
        );
        const [storedRefund, storedOperation, outbox] = await Promise.all([
          scope.model.refundOperation.getById(refund.id),
          scope.model.providerOperation.getById(providerOperation.id),
          scope.model.outboxEvent.select({
            where: { paymentSessionId: fixture.paymentSessionId! },
          }),
        ]);
        assert.equal(storedRefund?.state, 'pending');
        assert.equal(storedOperation?.state, 'reconciliation_required');
        assert.equal(storedOperation?.providerResourceId, storedRefund?.providerRefundId);
        assert.equal(storedOperation?.claimToken, undefined);
        assert.equal(storedOperation?.claimExpiresAt, undefined);
        assert.ok(storedOperation?.nextAttemptAt && storedOperation.nextAttemptAt > new Date());
        assert.deepEqual(outbox, []);
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('fences an ambiguous refund submission until audited recovery', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        await scope.model.paymentSession.updateById(fixture.paymentSessionId!, {
          state: 'succeeded',
          providerCaptureId: `capture-${randomUUID().slice(0, 12)}`,
          finalizedAt: new Date(),
        });
        const refund = await scope.service.refundOperation.create({
          paymentSessionId: fixture.paymentSessionId!,
          businessReference: `refund-${randomUUID().slice(0, 12)}`,
          amountMinor: 1299,
          currency: 'USD',
          idempotencyKey: `refund-${randomUUID()}`,
          correlationId: `refund-${randomUUID()}`,
        });
        const operation = await scope.model.providerOperation.get({
          refundOperationId: refund.id,
          kind: 'refund',
        });
        assert.ok(operation);
        const providerRequestId = operation.idempotencyKey;
        assert.match(
          providerRequestId,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        const claimed = await scope.service.providerOperation.claim(operation.id);
        assert.ok(claimed?.claimToken);
        await scope.service.providerOperation.markSubmitted(operation.id, claimed.claimToken);
        await scope.service.providerOperation.releaseForReconciliation(
          operation.id,
          claimed.claimToken,
          new Error('provider secret token must never persist'),
        );
        const failed = await scope.model.providerOperation.getById(operation.id);
        assert.equal(failed?.state, 'reconciliation_required');
        assert.equal(failed?.attemptCount, 1);
        assert.equal(failed?.errorCode, 'refund_submission_outcome_unknown');
        assert.equal(failed?.errorSummary, 'Provider refund submission outcome is unknown');
        assert.equal(failed?.providerRequestId, providerRequestId);
        assert.equal(failed?.idempotencyKey, providerRequestId);
        assert.equal(failed?.errorSummary?.includes('secret'), false);
        await scope.model.providerOperation.updateById(operation.id, {
          nextAttemptAt: new Date(0),
        });
        await scope.service.providerOperation.queueDue();
        const fenced = await scope.model.providerOperation.getById(operation.id);
        assert.equal(fenced?.attemptCount, 1);
        await scope.service.providerOperation.reconcileRefund(operation.id, {
          actionIdempotencyKey: randomUUID(),
          reason: 'Provider outcome could not be verified',
        });
        const audits = await scope.model.providerOperationRecoveryAudit.select({
          where: { providerOperationId: operation.id },
        });
        assert.equal(audits.length, 1);
        assert.equal(audits[0].action, 'reconcile');
        assert.equal(audits[0].resolution, 'unresolved');
        await assert.rejects(
          scope.service.providerOperation.retryRefund(operation.id, {
            actionIdempotencyKey: randomUUID(),
            reason: 'Retry without acknowledgement',
          }),
          { status: 409 },
        );
        const retryKey = randomUUID();
        await scope.service.providerOperation.retryRefund(operation.id, {
          actionIdempotencyKey: retryKey,
          reason: 'Retry the original provider request after reconciliation',
          acknowledgeRetryRisk: true,
        });
        const retried = await scope.model.providerOperation.getById(operation.id);
        assert.equal(retried?.attemptCount, 2);
        assert.equal(retried?.providerRequestId, providerRequestId);
        assert.equal(retried?.idempotencyKey, providerRequestId);
        const retryAudit = await scope.model.providerOperationRecoveryAudit.get({
          providerOperationId: operation.id,
          actionIdempotencyKey: retryKey,
        });
        assert.equal(retryAudit?.action, 'retry');
        assert.equal(retryAudit?.resolution, 'retried');
        await scope.service.providerOperation.retryRefund(operation.id, {
          actionIdempotencyKey: retryKey,
          reason: 'Retry the original provider request after reconciliation',
          acknowledgeRetryRisk: true,
        });
        assert.equal((await scope.model.providerOperation.getById(operation.id))?.attemptCount, 2);
        await assert.rejects(
          scope.service.providerOperation.retryRefund(operation.id, {
            actionIdempotencyKey: randomUUID(),
            reason: 'A second retry must be denied',
            acknowledgeRetryRisk: true,
          }),
          { status: 409 },
        );
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('finalizes an exhausted payment start operation from provider failure', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        const operation = await scope.service.providerOperation.ensureStart(
          fixture.paymentSessionId!,
        );
        const claimed = await scope.service.providerOperation.claim(operation.id);
        assert.ok(claimed?.claimToken);
        await scope.service.providerOperation.markSubmitted(operation.id, claimed.claimToken);
        await scope.model.providerOperation.updateById(operation.id, { attemptCount: 10 });

        await scope.service.providerOperation.releaseForReconciliation(
          operation.id,
          claimed.claimToken,
          new Error('provider start failed'),
        );

        const [storedSession, storedOperation, audits, outbox] = await Promise.all([
          scope.model.paymentSession.getById(fixture.paymentSessionId!),
          scope.model.providerOperation.getById(operation.id),
          scope.model.paymentAudit.select({
            where: { paymentSessionId: fixture.paymentSessionId! },
          }),
          scope.model.outboxEvent.select({
            where: { paymentSessionId: fixture.paymentSessionId! },
          }),
        ]);
        assert.equal(storedSession?.state, 'failed');
        assert.ok(storedSession?.finalizedAt);
        assert.equal(storedOperation?.state, 'failed');
        assert.equal(storedOperation?.claimToken, undefined);
        assert.equal(storedOperation?.nextAttemptAt, undefined);
        assert.equal(storedOperation?.errorCode, 'provider_operation_failed');
        assert.equal(
          storedOperation?.errorSummary,
          'Provider operation failed and will be reconciled',
        );
        assert.equal(audits.length, 2);
        assert.equal(audits[1].providerOperationId, operation.id);
        assert.equal(audits[1].fromState, 'starting');
        assert.equal(audits[1].toState, 'failed');
        assert.equal(audits[1].source, 'providerOperation.start.attemptsExhausted');
        assert.equal(outbox.length, 1);
        assert.equal(outbox[0].eventType, 'payment.outcome.v1');
        assert.deepEqual((outbox[0].payload as any).state, 'failed');
      } finally {
        await cleanup(fixture);
      }
    });
  });

  it('finalizes an exhausted eligible payment operation only once', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture = await createFixture(new Date(Date.now() + 60_000));
      try {
        const scope = app.scope('a-pay');
        const operation = await scope.service.providerOperation.ensureStart(
          fixture.paymentSessionId!,
        );
        await scope.model.providerOperation.updateById(operation.id, {
          attemptCount: 10,
          nextAttemptAt: new Date(0),
          errorCode: 'provider_operation_failed',
          errorSummary: 'Provider operation failed and will be reconciled',
        });

        assert.equal(await scope.service.providerOperation.claim(operation.id), undefined);
        assert.equal(await scope.service.providerOperation.claim(operation.id), undefined);

        const [storedSession, storedOperation, audits, outbox] = await Promise.all([
          scope.model.paymentSession.getById(fixture.paymentSessionId!),
          scope.model.providerOperation.getById(operation.id),
          scope.model.paymentAudit.select({
            where: { paymentSessionId: fixture.paymentSessionId! },
          }),
          scope.model.outboxEvent.select({
            where: { paymentSessionId: fixture.paymentSessionId! },
          }),
        ]);
        assert.equal(storedSession?.state, 'failed');
        assert.equal(storedOperation?.state, 'failed');
        assert.equal(audits.length, 2);
        assert.equal(outbox.length, 1);
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
