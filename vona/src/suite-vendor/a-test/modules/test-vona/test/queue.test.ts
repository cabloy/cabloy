import type { Queue } from 'bullmq';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { on } from 'node:events';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

async function assertRemoved(queue: Queue, jobId: string) {
  assert.equal(await queue.getJob(jobId), undefined);
  const client = await queue.client;
  assert.equal(await client.zscore(queue.toKey('completed'), jobId), null);
  assert.equal(await client.zscore(queue.toKey('failed'), jobId), null);
}

async function removeOwnedJobs(queue: Queue, jobIds: string[]) {
  for (const jobId of jobIds) {
    const job = await queue.getJob(jobId);
    await job?.remove();
  }
}

describe('queue.test.ts', { concurrency: false }, () => {
  it('action:queue', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('post', '/test/vona/queue/push');
      await app.bean.executor.performAction('post', '/test/vona/queue/pushAsync');
    });
  });

  it('removes completed and terminally failed jobs without losing results or retries', async () => {
    await app.bean.executor.mockCtx(async () => {
      const bean = app.scope('test-vona').queue.test;
      const queue = bean.getQueue();
      const jobIds = [randomUUID(), randomUUID(), randomUUID()];
      try {
        assert.equal(await bean.pushAsync({ a: 1, b: 2 }, { jobOptions: { jobId: jobIds[0] } }), 3);
        await assertRemoved(queue, jobIds[0]);

        await assert.rejects(
          bean.pushAsync(
            { a: 1, b: 2, failAttempts: 2 },
            { jobOptions: { jobId: jobIds[1], attempts: 2 } },
          ),
          /queue test failure/,
        );
        await assertRemoved(queue, jobIds[1]);

        assert.equal(
          await bean.pushAsync(
            { a: 1, b: 2, failAttempts: 1 },
            { jobOptions: { jobId: jobIds[2], attempts: 2 } },
          ),
          3,
        );
        await assertRemoved(queue, jobIds[2]);
      } finally {
        await removeOwnedJobs(queue, jobIds);
      }
    });
  });

  it('allows explicit job options to retain successful and failed jobs', async () => {
    await app.bean.executor.mockCtx(async () => {
      const bean = app.scope('test-vona').queue.test;
      const queue = bean.getQueue();
      const jobIds = [randomUUID(), randomUUID()];
      try {
        await bean.pushAsync(
          { a: 1, b: 2 },
          { jobOptions: { jobId: jobIds[0], removeOnComplete: false } },
        );
        assert.equal(await (await queue.getJob(jobIds[0]))?.getState(), 'completed');

        await assert.rejects(
          bean.pushAsync(
            { a: 1, b: 2, failAttempts: 1 },
            { jobOptions: { jobId: jobIds[1], removeOnFail: false } },
          ),
          /queue test failure/,
        );
        assert.equal(await (await queue.getJob(jobIds[1]))?.getState(), 'failed');
      } finally {
        await removeOwnedJobs(queue, jobIds);
      }
    });
  });

  it('allows bean worker retention and higher-priority job removal', async () => {
    await app.bean.executor.mockCtx(async () => {
      const bean = app.scope('test-vona').queue.retained;
      const queue = bean.getQueue();
      const jobIds = [randomUUID(), randomUUID(), randomUUID()];
      try {
        await bean.pushAsync({ a: 1, b: 2 }, { jobOptions: { jobId: jobIds[0] } });
        assert.equal(await (await queue.getJob(jobIds[0]))?.getState(), 'completed');

        await assert.rejects(
          bean.pushAsync({ a: 1, b: 2, failAttempts: 1 }, { jobOptions: { jobId: jobIds[1] } }),
          /queue test failure/,
        );
        assert.equal(await (await queue.getJob(jobIds[1]))?.getState(), 'failed');

        await bean.pushAsync(
          { a: 1, b: 2 },
          { jobOptions: { jobId: jobIds[2], removeOnComplete: true } },
        );
        await assertRemoved(queue, jobIds[2]);
      } finally {
        await removeOwnedJobs(queue, jobIds);
      }
    });
  });

  it('applies worker defaults and schedule template overrides to scheduler jobs', async () => {
    await app.bean.executor.mockCtx(async () => {
      const service = app.scope('a-schedule').service.schedule;
      const queueService = app.scope('a-queue').service.queue;
      const { queue, queueEvents } = queueService._ensureQueue(
        queueService.prepareJobInfo('a-schedule:schedule', undefined),
      );
      await queueEvents.waitUntilReady();
      for (const scheduleName of ['test-vona:test', 'test-vona:test3'] as const) {
        const schedulerId = service.getScheduleKey(app.ctx.instanceName, scheduleName);
        const completed = on(queueEvents, 'completed', { signal: AbortSignal.timeout(10_000) });
        const jobIds: string[] = [];
        try {
          await service.addSchedule(scheduleName);
          for await (const [event] of completed) {
            const jobId = event.jobId as string;
            if (!jobId.startsWith(`repeat:${schedulerId}:`)) continue;
            jobIds.push(jobId);
            // Test mode skips scheduled business callbacks, but completes the queue job.
            if (scheduleName === 'test-vona:test') {
              await assertRemoved(queue, jobId);
            } else {
              const job = await queue.getJob(jobId);
              assert.equal(await job?.getState(), 'completed');
              assert.deepEqual(job?.opts.removeOnComplete, { count: 10 });
            }
            break;
          }
        } finally {
          await completed.return?.();
          await service.deleteSchedule(scheduleName);
          await removeOwnedJobs(queue, jobIds);
        }
      }
    });
  });
});
