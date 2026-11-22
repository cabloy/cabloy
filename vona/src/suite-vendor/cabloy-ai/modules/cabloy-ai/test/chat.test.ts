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
const ssrSiteId = 'web';

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
  return { ssrSiteId, conversationId, requestKey, text };
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
          (
            await scope().service.conversation.create(userId, {
              ssrSiteId,
              title: 'Owned duplicate test',
            })
          ).id,
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
          () => scope().service.conversation.remove(userId, ssrSiteId, conversationId!),
          isCode(409),
        );
        const run = results[0]!.run;
        await scope().service.run.finalize(userId, ssrSiteId, run.id, conversationId!, {
          status: 'completed',
          text: 'Reply',
        });
        const replay = await scope().service.run.prepare(userId, input, identity, limits);
        assert.equal(replay.replay, true);
        assert.equal(replay.run.status, 'completed');
        const history = await scope().service.conversation.history(
          userId,
          ssrSiteId,
          conversationId!,
        );
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
        assert.equal(usage.cacheReadTokens, null);
        assert.equal(usage.cacheWriteTokens, null);
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('admits only one competing distinct key, with no orphan user turn', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, { ssrSiteId })).id,
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
        async () => (await scope().service.conversation.create(userId, { ssrSiteId })).id,
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
        const late = await scope().service.run.finalize(
          userId,
          ssrSiteId,
          first.run.id,
          conversationId!,
          {
            status: 'completed',
            text: 'Must not persist',
          },
        );
        assert.equal(late.status, 'interrupted');
        const conversation = await scope().service.conversation.requireOwned(
          userId,
          ssrSiteId,
          conversationId!,
        );
        assert.equal(String(conversation.activeRunId), String(second.run.id));
        await scope().service.run.finalize(userId, ssrSiteId, second.run.id, conversationId!, {
          status: 'failed',
          errorCode: 'chat_failed',
        });
        assert.deepEqual(
          (await scope().service.conversation.history(userId, ssrSiteId, conversationId!)).messages,
          [],
        );
        const status = await scope().service.run.status(userId, firstInput);
        assert.equal(status?.errorCode, 'chat_timeout');
        assert.equal(
          Number(await scope().model.usage.count({ where: { conversationId, userId } })),
          2,
        );
        await scope().service.conversation.remove(userId, ssrSiteId, conversationId!);
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
        async () => (await scope().service.conversation.create(userId, { ssrSiteId })).id,
      );
      await context(async () => {
        const otherUser = userId - 1;
        assert.deepEqual(await scope().service.conversation.list(otherUser, ssrSiteId), []);
        await assert.rejects(
          () => scope().service.conversation.history(otherUser, ssrSiteId, conversationId!),
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
          () => scope().service.conversation.remove(otherUser, ssrSiteId, conversationId!),
          isCode(404),
        );
      });
      await app.bean.executor.mockCtx(
        async () => {
          await assert.rejects(
            () => scope().service.conversation.history(userId, ssrSiteId, conversationId!),
            isCode(404),
          );
          await assert.rejects(
            () => scope().service.run.prepare(userId, command(conversationId!), identity, limits),
            isCode(404),
          );
          await assert.rejects(
            () => scope().service.conversation.remove(userId, ssrSiteId, conversationId!),
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
        async () => (await scope().service.conversation.create(userId, { ssrSiteId })).id,
      );
      const input = command(conversationId);
      await context(async () => {
        const service = scope().service.run;
        const admitted = await service.prepare(userId, input, identity, limits);
        await service.finalize(userId, ssrSiteId, admitted.run.id, conversationId!, {
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

  it('localizes chat errors while preserving their status codes', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      conversationId = await context(
        async () => (await scope().service.conversation.create(userId, { ssrSiteId })).id,
      );
      const input = command(conversationId);
      await context(async () => scope().service.run.prepare(userId, input, identity, limits));
      for (const locale of ['en-us', 'zh-cn'] as const) {
        await app.bean.executor.mockCtx(
          async () => {
            const conversation = scope().service.conversation;
            const run = scope().service.run;
            const chinese = locale === 'zh-cn';
            await assert.rejects(
              () => conversation.create(userId, { ssrSiteId, title: 'x'.repeat(121) }),
              {
                code: 422,
                message: chinese ? '对话标题无效' : 'Invalid conversation title',
              },
            );
            await assert.rejects(
              () => conversation.requireOwned(userId - 1, ssrSiteId, conversationId!),
              {
                code: 404,
                message: chinese ? '对话不存在' : 'Conversation not found',
              },
            );
            await assert.rejects(() => conversation.remove(userId, ssrSiteId, conversationId!), {
              code: 409,
              message: chinese ? '对话中有正在进行的请求' : 'Conversation has an active run',
            });
            await assert.rejects(
              () => run.prepare(userId, { ...input, text: 'Changed' }, identity, limits),
              {
                code: 409,
                message: chinese
                  ? '请求标识已用于其他消息内容'
                  : 'Request key already used with different text',
              },
            );
            await assert.rejects(
              () => run.prepare(userId, { ...input, text: '' }, identity, limits),
              { code: 422, message: chinese ? '消息内容无效' : 'Invalid chat text' },
            );
            await assert.rejects(
              () => run.prepare(userId, { ...input, requestKey: '' }, identity, limits),
              { code: 422, message: chinese ? '请求标识无效' : 'Invalid request key' },
            );
          },
          { locale },
        );
      }
    } finally {
      await cleanup(conversationId);
    }
  });

  it('returns raw unnamed and generated titles independently of the request locale', async () => {
    let conversationId: TableIdentity | undefined;
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const conversation = scope().service.conversation;
          const created = await conversation.create(userId, { ssrSiteId });
          conversationId = created.id;
          assert.equal(created.title, '');
          assert.equal((await conversation.requireOwned(userId, ssrSiteId, created.id)).title, '');
        },
        { locale: 'zh-cn' },
      );
      for (const locale of ['en-us', 'zh-cn'] as const) {
        await app.bean.executor.mockCtx(
          async () => {
            const conversation = scope().service.conversation;
            assert.equal(
              (await conversation.history(userId, ssrSiteId, conversationId!)).conversation.title,
              '',
            );
            assert.equal((await conversation.list(userId, ssrSiteId))[0]?.title, '');
          },
          { locale },
        );
      }
      await app.bean.executor.mockCtx(
        async () => {
          const conversation = scope().service.conversation;
          const input = command(conversationId!, randomUUID(), '订单系统设计');
          const { run } = await scope().service.run.prepare(userId, input, identity, limits);
          await scope().service.run.finalize(userId, ssrSiteId, run.id, conversationId!, {
            status: 'completed',
            text: 'Reply',
          });
          const bound = await app.bean.ai.create();
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId!,
            run.id,
            input.text,
            bound,
          );
        },
        { locale: 'zh-cn' },
      );
      for (const locale of ['en-us', 'zh-cn'] as const) {
        await app.bean.executor.mockCtx(
          async () => {
            const conversation = scope().service.conversation;
            assert.equal(
              (await conversation.history(userId, ssrSiteId, conversationId!)).conversation.title,
              'AI test response: 订单系统设计',
            );
            await scope().model.conversation.update({ id: conversationId, title: '我的标题' });
            assert.equal((await conversation.list(userId, ssrSiteId))[0]?.title, '我的标题');
            await scope().model.conversation.update({
              id: conversationId,
              title: 'AI test response: 订单系统设计',
            });
          },
          { locale },
        );
      }
    } finally {
      await cleanup(conversationId);
    }
  });

  it('names only the first successful turn and does not regenerate on replay or later turns', async t => {
    let conversationId: TableIdentity | undefined;
    try {
      await context(async () => {
        const conversation = scope().service.conversation;
        const service = scope().service.run;
        conversationId = (await conversation.create(userId, { ssrSiteId })).id;
        const bound = await app.bean.ai.create();
        const generate = t.mock.method(bound, 'generateText');
        try {
          const failed = await service.prepare(userId, command(conversationId), identity, limits);
          await service.finalize(userId, ssrSiteId, failed.run.id, conversationId, {
            status: 'failed',
          });
          const input = command(conversationId, randomUUID(), 'Design an order system');
          const first = await service.prepare(userId, input, identity, limits);
          await service.finalize(userId, ssrSiteId, first.run.id, conversationId, {
            status: 'completed',
            text: 'Saved answer',
          });
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            first.run.id,
            input.text,
            bound,
          );
          assert.equal(generate.mock.callCount(), 1);
          const options = generate.mock.calls[0]!.arguments[0];
          assert.equal(options.prompt, input.text);
          assert.match(String(options.instructions), /Do not answer/);
          assert.equal(options.maxRetries, 0);
          assert.equal(options.timeout, 5000);
          assert.equal(options.maxOutputTokens, 96);
          const title = 'AI test response: Design an order system';
          assert.equal(
            (await conversation.history(userId, ssrSiteId, conversationId)).conversation.title,
            title,
          );
          assert.equal((await conversation.list(userId, ssrSiteId))[0]?.title, title);
          assert.equal((await service.prepare(userId, input, identity, limits)).replay, true);
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            first.run.id,
            input.text,
            bound,
          );
          const nextInput = command(conversationId, randomUUID(), 'A different topic');
          const next = await service.prepare(userId, nextInput, identity, limits);
          await service.finalize(userId, ssrSiteId, next.run.id, conversationId, {
            status: 'completed',
            text: 'Another answer',
          });
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            next.run.id,
            nextInput.text,
            bound,
          );
          assert.equal(generate.mock.callCount(), 1);
          assert.equal(
            (await conversation.requireOwned(userId, ssrSiteId, conversationId)).title,
            title,
          );
        } finally {
          generate.mock.restore();
        }
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('preserves custom titles, including a title changed while generation is in flight', async t => {
    let conversationId: TableIdentity | undefined;
    try {
      await context(async () => {
        const conversation = scope().service.conversation;
        const service = scope().service.run;
        conversationId = (await conversation.create(userId, { ssrSiteId, title: 'My title' })).id;
        const input = command(conversationId);
        const { run } = await service.prepare(userId, input, identity, limits);
        await service.finalize(userId, ssrSiteId, run.id, conversationId, {
          status: 'completed',
          text: 'Reply',
        });
        const bound = await app.bean.ai.create();
        const generate = t.mock.method(bound, 'generateText', async () => {
          await scope().model.conversation.update({ id: conversationId, title: 'Edited title' });
          return { text: 'Generated title' } as any;
        });
        try {
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            run.id,
            input.text,
            bound,
          );
          assert.equal(generate.mock.callCount(), 0);
          assert.equal(
            (await conversation.requireOwned(userId, ssrSiteId, conversationId)).title,
            'My title',
          );
          await scope().model.conversation.update({
            id: conversationId,
            title: '',
          });
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            run.id,
            input.text,
            bound,
          );
          assert.equal(generate.mock.callCount(), 1);
          assert.equal(
            (await conversation.requireOwned(userId, ssrSiteId, conversationId)).title,
            'Edited title',
          );
        } finally {
          generate.mock.restore();
        }
      });
    } finally {
      await cleanup(conversationId);
    }
  });

  it('keeps completed answers when title generation fails or is empty and skips later turns', async t => {
    let conversationId: TableIdentity | undefined;
    try {
      await context(async () => {
        const conversation = scope().service.conversation;
        const service = scope().service.run;
        conversationId = (await conversation.create(userId, { ssrSiteId })).id;
        const input = command(conversationId);
        const { run } = await service.prepare(userId, input, identity, limits);
        await service.finalize(userId, ssrSiteId, run.id, conversationId, {
          status: 'completed',
          text: 'Reply',
        });
        const bound = await app.bean.ai.create();
        const generate = t.mock.method(bound, 'generateText', async () => {
          throw new Error('Title provider failed');
        });
        try {
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            run.id,
            input.text,
            bound,
          );
          generate.mock.mockImplementation(async () => ({ text: ' \n ' }) as any);
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            run.id,
            input.text,
            bound,
          );
          const history = await conversation.history(userId, ssrSiteId, conversationId);
          assert.equal(history.conversation.title, '');
          assert.equal(
            (await conversation.requireOwned(userId, ssrSiteId, conversationId)).title,
            '',
          );
          assert.deepEqual(
            history.messages.map(message => message.text),
            ['Hello', 'Reply'],
          );
          assert.equal((await service.status(userId, input))?.status, 'completed');
          const next = await service.prepare(userId, command(conversationId), identity, limits);
          await service.finalize(userId, ssrSiteId, next.run.id, conversationId, {
            status: 'completed',
            text: 'Next reply',
          });
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            next.run.id,
            'Hello',
            bound,
          );
          assert.equal(generate.mock.callCount(), 2);
          generate.mock.mockImplementation(
            async () => ({ text: `“  Order\n${'design '.repeat(30)} ”` }) as any,
          );
          await conversation.generateTitle(
            userId,
            ssrSiteId,
            conversationId,
            run.id,
            input.text,
            bound,
          );
          const title = (await conversation.requireOwned(userId, ssrSiteId, conversationId)).title;
          assert.equal(title.length, 120);
          assert.match(title, /^Order design/);
          assert.doesNotMatch(title, /[\n“”]/);
        } finally {
          generate.mock.restore();
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
        async () => (await scope().service.conversation.create(userId, { ssrSiteId })).id,
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
          (await scope().service.conversation.requireOwned(userId, ssrSiteId, conversationId!))
            .activeRunId,
          null,
        );
      });
    } finally {
      await cleanup(conversationId);
    }
  });
});
