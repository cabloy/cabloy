import type { TableIdentity } from 'table-identity';

import { randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

const ClaimLeaseMilliseconds = 60_000;
const MaxAttempts = 10;

@Service()
export class ServiceOutbox extends BeanBase {
  async enqueue(
    paymentSessionId: TableIdentity,
    eventType: string,
    payload: Record<string, unknown>,
  ) {
    const event = await this.scope.model.outboxEvent.insert({
      eventType,
      paymentSessionId,
      payload,
      state: 'pending',
      attemptCount: 0,
      nextAttemptAt: new Date(),
    });
    this.ctx.db.commit(() => {
      this.scope.queue.outboxDispatch.push({ outboxEventId: event.id });
    });
    return event;
  }

  @Core.transaction()
  async claim(id: TableIdentity) {
    const event = await this.scope.model.outboxEvent.getByIdForUpdate(id);
    if (!event || event.state === 'dispatched' || event.state === 'failed') return undefined;
    const now = new Date();
    const eligible =
      (event.state === 'pending' && (!event.nextAttemptAt || event.nextAttemptAt <= now)) ||
      (event.state === 'claimed' && !!event.claimExpiresAt && event.claimExpiresAt <= now);
    if (!eligible) return undefined;
    if (event.attemptCount >= MaxAttempts) {
      await this.scope.model.outboxEvent.updateById(event.id, {
        state: 'failed',
        errorSummary: 'outbox delivery attempts exhausted',
      });
      return undefined;
    }
    const claimToken = randomUUID();
    const claimedAt = now;
    const claimExpiresAt = new Date(now.getTime() + ClaimLeaseMilliseconds);
    await this.scope.model.outboxEvent.updateById(event.id, {
      state: 'claimed',
      claimedAt,
      claimToken,
      claimExpiresAt,
      attemptCount: event.attemptCount + 1,
      errorSummary: undefined,
    });
    return {
      ...event,
      state: 'claimed' as const,
      claimedAt,
      claimToken,
      claimExpiresAt,
      attemptCount: event.attemptCount + 1,
      errorSummary: undefined,
    };
  }

  @Core.transaction()
  async markDispatched(id: TableIdentity, claimToken: string) {
    const event = await this.scope.model.outboxEvent.getByIdForUpdate(id);
    if (!event || event.state !== 'claimed' || event.claimToken !== claimToken) return undefined;
    const dispatchedAt = new Date();
    await this.scope.model.outboxEvent.updateById(event.id, {
      state: 'dispatched',
      dispatchedAt,
      claimedAt: undefined,
      claimToken: undefined,
      claimExpiresAt: undefined,
      errorSummary: undefined,
    });
    return { ...event, state: 'dispatched' as const, dispatchedAt };
  }

  @Core.transaction()
  async release(id: TableIdentity, claimToken: string, error: unknown) {
    const event = await this.scope.model.outboxEvent.getByIdForUpdate(id);
    if (!event || event.state !== 'claimed' || event.claimToken !== claimToken) return undefined;
    const errorSummary = summarizeError(error);
    if (event.attemptCount >= MaxAttempts) {
      await this.scope.model.outboxEvent.updateById(event.id, {
        state: 'failed',
        claimedAt: undefined,
        claimToken: undefined,
        claimExpiresAt: undefined,
        errorSummary,
      });
      return { ...event, state: 'failed' as const, errorSummary };
    }
    const nextAttemptAt = new Date(Date.now() + retryDelayMilliseconds(event.attemptCount));
    await this.scope.model.outboxEvent.updateById(event.id, {
      state: 'pending',
      claimedAt: undefined,
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt,
      errorSummary,
    });
    return { ...event, state: 'pending' as const, nextAttemptAt, errorSummary };
  }

  async queueDue(limit = 100) {
    const now = new Date();
    const pending = await this.scope.model.outboxEvent.select({
      where: {
        state: 'pending',
        nextAttemptAt: { _lte_: now },
      },
      orders: [
        ['nextAttemptAt', 'asc'],
        ['id', 'asc'],
      ],
      limit,
    });
    const claimed = await this.scope.model.outboxEvent.select({
      where: {
        state: 'claimed',
        claimExpiresAt: { _lte_: now },
      },
      orders: [
        ['claimExpiresAt', 'asc'],
        ['id', 'asc'],
      ],
      limit: Math.max(0, limit - pending.length),
    });
    const events = [...pending, ...claimed];
    for (const event of events) {
      await this.scope.queue.outboxDispatch.pushAsync({ outboxEventId: event.id });
    }
    return events.length;
  }
}

function retryDelayMilliseconds(attemptCount: number) {
  return Math.min(60_000, 1_000 * 2 ** Math.max(0, attemptCount - 1));
}

function summarizeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 255);
}
