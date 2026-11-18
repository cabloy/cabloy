import type { TableIdentity } from 'table-identity';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const identity = {
  aiScene: 'cabloy-ai:default',
  aiProvider: 'test',
  aiModel: 'default',
  modelId: 'mock',
};
const limits = { timeoutMs: 60000, maxInputCharacters: 32000, maxOutputTokens: 4096 };
const userId = -818101;

// Every contender owns its own scoped state, including its datasource transaction.
const context = <T>(fn: () => Promise<T>) => app.bean.executor.mockCtx(fn);
const scope = () => app.scope('cabloy-ai');

async function cleanup(conversationId: TableIdentity | undefined) {
  if (conversationId == null) return;
  await context(async () => {
    await scope().model.usage.delete({ conversationId, userId });
    await scope().model.message.delete({ conversationId, userId });
    await scope().model.run.delete({ conversationId, userId });
    await scope().model.conversation.delete({ id: conversationId, userId });
  });
}

function command(conversationId: TableIdentity, requestKey = randomUUID(), text = 'Hello') {
  return { conversationId, requestKey, text };
}

function isCode(code: number) {
  return (error: { code?: number }) => error.code === code;
}

describe('cabloy-ai private chat domain', { concurrency: false }, () => {
  it('serializes duplicate keys before active admission and rejects changed payloads and other keys', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () =>
          (await scope().service.conversation.create(userId, { title: 'Owned duplicate test' })).id,
      );
      const input = command(conversationId);
      const results = await Promise.all(
        [0, 1].map(() =>
          context(async () => scope().service.run.prepare(userId, input, identity, limits)),
        ),
      );
      assert.equal(String(results[0]!.run.id), String(results[1]!.run.id));
      assert.deepEqual(results.map(result => result.replay).sort(), [false, true]);
      await context(async () => {
        assert.equal(
          Number(await scope().model.run.count({ where: { conversationId, userId } })),
          1,
        );
        assert.equal(
          Number(await scope().model.message.count({ where: { conversationId, userId } })),
          1,
        );
        await assert.rejects(
          () =>
            scope().service.run.prepare(userId, { ...input, text: 'Changed' }, identity, limits),
          isCode(409),
        );
        await assert.rejects(
          () => scope().service.run.prepare(userId, command(conversationId!), identity, limits),
          isCode(409),
        );
        await assert.rejects(
          () => scope().service.conversation.remove(userId, conversationId!),
          isCode(409),
        );
        const run = results[0]!.run;
        await scope().service.run.finalize(userId, run.id, conversationId!, {
          status: 'completed',
          text: 'Reply',
        });
        const replay = await scope().service.run.prepare(userId, input, identity, limits);
        assert.equal(replay.replay, true);
        assert.equal(replay.run.status, 'completed');
        const history = await scope().service.conversation.history(userId, conversationId!);
        assert.deepEqual(
          history.messages.map(message => [message.role, message.text]),
          [
            ['user', 'Hello'],
            ['assistant', 'Reply'],
          ],
        );
        const usage = await scope().model.usage.get({ runId: run.id });
        assert.ok(usage);
        assert.equal(usage.inputTokens, null);
        assert.equal(usage.totalTokens, null);
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('admits only one competing distinct key, with no orphan user turn', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, {})).id,
      );
      const outcomes = await Promise.allSettled(
        [0, 1].map(() =>
          context(async () =>
            scope().service.run.prepare(userId, command(conversationId!), identity, limits),
          ),
        ),
      );
      assert.equal(outcomes.filter(outcome => outcome.status === 'fulfilled').length, 1);
      const rejected = outcomes.find(outcome => outcome.status === 'rejected');
      assert.ok(rejected?.status === 'rejected');
      assert.equal(rejected.reason.code, 409);
      await context(async () => {
        assert.equal(
          Number(await scope().model.run.count({ where: { conversationId, userId } })),
          1,
        );
        assert.equal(
          Number(await scope().model.message.count({ where: { conversationId, userId } })),
          1,
        );
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('reconciles expired admission, fences a late completion, and excludes partial turns from history', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, {})).id,
      );
      const firstInput = command(conversationId);
      const first = await context(async () =>
        scope().service.run.prepare(userId, firstInput, identity, limits),
      );
      await context(async () => {
        await scope().model.run.update({ id: first.run.id, deadlineAt: Date.now() - 1 });
      });
      const second = await context(async () =>
        scope().service.run.prepare(userId, command(conversationId!), identity, limits),
      );
      await context(async () => {
        const late = await scope().service.run.finalize(userId, first.run.id, conversationId!, {
          status: 'completed',
          text: 'Must not persist',
        });
        assert.equal(late.status, 'interrupted');
        const conversation = await scope().service.conversation.requireOwned(
          userId,
          conversationId!,
        );
        assert.equal(String(conversation.activeRunId), String(second.run.id));
        await scope().service.run.finalize(userId, second.run.id, conversationId!, {
          status: 'failed',
          errorCode: 'chat_failed',
        });
        assert.deepEqual(
          (await scope().service.conversation.history(userId, conversationId!)).messages,
          [],
        );
        const status = await scope().service.run.status(userId, firstInput);
        assert.equal(status?.errorCode, 'chat_timeout');
        assert.equal(
          Number(await scope().model.usage.count({ where: { conversationId, userId } })),
          2,
        );
        await scope().service.conversation.remove(userId, conversationId!);
        assert.equal(await scope().model.conversation.getById(conversationId!), undefined);
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('keeps ownership and instance scope on every read/admission/delete path', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, {})).id,
      );
      await context(async () => {
        const otherUser = userId - 1;
        assert.deepEqual(await scope().service.conversation.list(otherUser), []);
        await assert.rejects(
          () => scope().service.conversation.history(otherUser, conversationId!),
          isCode(404),
        );
        await assert.rejects(
          () => scope().service.run.status(otherUser, command(conversationId!)),
          isCode(404),
        );
        await assert.rejects(
          () => scope().service.run.prepare(otherUser, command(conversationId!), identity, limits),
          isCode(404),
        );
        await assert.rejects(
          () => scope().service.conversation.remove(otherUser, conversationId!),
          isCode(404),
        );
      });
      await app.bean.executor.mockCtx(
        async () => {
          await assert.rejects(
            () => scope().service.conversation.history(userId, conversationId!),
            isCode(404),
          );
          await assert.rejects(
            () => scope().service.run.prepare(userId, command(conversationId!), identity, limits),
            isCode(404),
          );
          await assert.rejects(
            () => scope().service.conversation.remove(userId, conversationId!),
            isCode(404),
          );
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      await cleanup(conversationId);
    }
  });

  it('replays the durable run before resolving unavailable deployment configuration', async t => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, {})).id,
      );
      const input = command(conversationId);
      await context(async () => {
        const service = scope().service.run;
        const admitted = await service.prepare(userId, input, identity, limits);
        await service.finalize(userId, admitted.run.id, conversationId!, {
          status: 'completed',
          text: 'Reply',
        });
        // Replace only these request-owned collaborators; no app-global configuration mutation.
        const create = t.mock.method(app.bean.ai, 'create', async () => {
          throw new Error('deployment unavailable');
        });
        const replay = t.mock.method(
          service as any,
          'replay',
          async (run: { id: TableIdentity; status: string }) => {
            assert.equal(String(run.id), String(admitted.run.id));
            assert.equal(run.status, 'completed');
          },
        );
        try {
          await service.send(userId, input);
          assert.equal(replay.mock.callCount(), 1);
          assert.equal(create.mock.callCount(), 0);
          await assert.rejects(
            () => service.send(userId, { ...input, text: 'Changed' }),
            isCode(409),
          );
          await assert.rejects(
            () => service.send(userId, command(conversationId!)),
            /deployment unavailable/,
          );
          assert.equal(
            Number(await scope().model.run.count({ where: { conversationId, userId } })),
            1,
          );
        } finally {
          replay.mock.restore();
          create.mock.restore();
        }
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('rolls back admission if its user message cannot persist', async t => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, {})).id,
      );
      await context(async () => {
        const message = scope().model.message;
        const insert = t.mock.method(message, 'insert', async () => {
          throw new Error('owned persistence fault');
        });
        try {
          await assert.rejects(
            () => scope().service.run.prepare(userId, command(conversationId!), identity, limits),
            /owned persistence fault/,
          );
        } finally {
          insert.mock.restore();
        }
        assert.equal(
          Number(await scope().model.run.count({ where: { conversationId, userId } })),
          0,
        );
        assert.equal(
          (await scope().service.conversation.requireOwned(userId, conversationId!)).activeRunId,
          null,
        );
      });
    } finally {
      await cleanup(conversationId);
    }
  });
});
