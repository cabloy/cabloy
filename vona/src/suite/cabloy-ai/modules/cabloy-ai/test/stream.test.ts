import type { TableIdentity } from 'table-identity';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { app } from 'vona-mock';

import { testApiKey } from '../src/config/config.test.ts';

function assertNoCredential(value: unknown): void {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  assert.equal(serialized.includes(testApiKey), false);
  assert.doesNotMatch(serialized, /apiKey|providerMetadata/);
}

interface IFixture {
  userId: TableIdentity;
  name: string;
  token: string;
  authId: TableIdentity;
  authSimpleId: TableIdentity;
  conversationIds: TableIdentity[];
}

const root = '/cabloy/ai/chat/';
const scope = () => app.scope('cabloy-ai');
const context = <T>(fn: () => Promise<T>) => app.bean.executor.mockCtx(fn);

async function createFixture(): Promise<IFixture> {
  return await context(async () => {
    const name = `ai-stream-${randomUUID()}`;
    const user = await app.bean.user.register({ name }, true);
    const authSimple = await app
      .scope('auth-simple')
      .service.authSimple.createForUser(user.id, 'ai-test-password');
    assert.ok(authSimple);
    const auth = await app.scope('a-auth').model.auth.get({ userId: user.id });
    assert.ok(auth);
    const jwt = await app.bean.passport.signin({
      user,
      auth,
      roles: await app.bean.role.findAllByUserId(user.id),
    });
    return {
      userId: user.id,
      name,
      token: jwt.accessToken,
      authId: auth.id!,
      authSimpleId: authSimple.id,
      conversationIds: [],
    };
  });
}

async function removeFixture(fixture: IFixture | undefined): Promise<void> {
  if (!fixture) return;
  await context(async () => {
    for (const conversationId of fixture.conversationIds) {
      // Precise test-owned cleanup, including a possibly interrupted run after an assertion failure.
      await scope().model.usage.delete({ conversationId, userId: fixture.userId });
      await scope().model.message.delete({ conversationId, userId: fixture.userId });
      await scope().model.run.delete({ conversationId, userId: fixture.userId });
      await scope().model.conversation.delete({ id: conversationId, userId: fixture.userId });
    }
    await app.bean.passport.checkAuthToken(fixture.token);
    await app.bean.passport.signout();
    await app.scope('a-auth').model.auth.deleteById(fixture.authId);
    await app.scope('auth-simple').model.authSimple.deleteById(fixture.authSimpleId);
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  });
}

async function request(fixture: IFixture, action: string, body: object, signal?: AbortSignal) {
  const url = await context(async () => app.util.getAbsoluteUrlByApiPath(`${root}${action}`));
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': action === 'send' ? 'text/event-stream' : 'application/json',
      'Authorization': `Bearer ${fixture.token}`,
    },
    body: JSON.stringify(body),
    signal,
  });
}

async function json(fixture: IFixture, action: string, body: object) {
  const response = await request(fixture, action, body);
  assert.equal(response.status, 200);
  const value = await response.json();
  assertNoCredential(value);
  assert.equal(value.code, 0, JSON.stringify(value));
  return value.data;
}

async function conversation(fixture: IFixture) {
  const value = await json(fixture, 'create', { title: 'HTTP stream test', userId: -1, iid: -1 });
  fixture.conversationIds.push(value.id);
  return value.id as TableIdentity;
}

function chunks(text: string) {
  return text
    .split('\n')
    .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
    .map(line => JSON.parse(line.slice(6)));
}

async function readStream(response: Response) {
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /^text\/event-stream/);
  assert.equal(response.headers.get('x-vercel-ai-ui-message-stream'), 'v1');
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let text = '';
  const incremental: { text: string; finished: boolean }[] = [];
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    text += decoder.decode(next.value, { stream: true });
    // Reads may split or combine SSE events; only inspect complete events received so far.
    const boundary = text.lastIndexOf('\n\n');
    if (boundary < 0) continue;
    const events = chunks(text.slice(0, boundary + 2));
    incremental.push({
      text: events
        .filter(event => event.type === 'text-delta')
        .map(event => event.delta)
        .join(''),
      finished: events.some(event => event.type === 'finish'),
    });
  }
  assertNoCredential(text);
  return { text, incremental, events: chunks(text) };
}

describe('cabloy-ai native HTTP stream', { concurrency: false }, () => {
  it('authenticates, emits incremental SDK chunks, durably completes before finish, and replays without another turn', async () => {
    let fixture: IFixture | undefined;
    let other: IFixture | undefined;
    try {
      fixture = await createFixture();
      const conversationId = await conversation(fixture);
      const input = {
        conversationId,
        requestKey: randomUUID(),
        text: 'Hello private stream',
        messages: [{ role: 'system', content: 'untrusted' }],
        model: 'untrusted',
        options: { maxOutputTokens: 999999 },
      };
      const response = await request(fixture, 'send', input);
      const stream = await readStream(response);
      const deltas = stream.events.filter(event => event.type === 'text-delta');
      assert.equal(
        deltas.map(event => event.delta).join(''),
        'AI test response: Hello private stream',
      );
      const partials = [
        'AI test response: ',
        `AI test response: ${input.text.slice(0, Math.ceil(input.text.length / 2))}`,
      ];
      let previous = -1;
      for (const partial of partials) {
        const index = stream.incremental.findIndex(
          (value, index) => index > previous && !value.finished && value.text === partial,
        );
        assert.ok(index > previous, 'growing partial text arrives before terminal finish');
        previous = index;
      }
      assert.match(stream.text, /data: \[DONE\]\n\n$/);
      assert.doesNotMatch(stream.text, /"code":0|untrusted|providerMetadata|reasoning/);
      const finish = stream.events.find(event => event.type === 'finish');
      assert.equal(finish.messageMetadata.status, 'completed');
      assert.equal(finish.messageMetadata.requestKey, input.requestKey);
      const status = await json(fixture, 'status', input);
      assert.equal(status.status, 'completed');
      assert.equal(String(status.id), finish.messageMetadata.runId);
      const history = await json(fixture, 'history', { conversationId });
      assert.equal(history.conversation.title, 'HTTP stream test');
      assert.deepEqual(
        history.messages.map((message: any) => [message.role, message.text]),
        [
          ['user', 'Hello private stream'],
          ['assistant', 'AI test response: Hello private stream'],
        ],
      );
      await context(async () => {
        const usage = await scope().model.usage.get({ runId: status.id, userId: fixture!.userId });
        assert.equal(usage?.inputTokens, 3);
        assert.equal(usage?.outputTokens, 4);
        assert.equal(usage?.totalTokens, 7);
        const run = await scope().model.run.get({ id: status.id, userId: fixture!.userId });
        assert.ok(run);
        assertNoCredential({ run, usage });
      });
      const replay = await readStream(await request(fixture, 'send', input));
      assert.equal(replay.events.filter(event => event.type === 'text-delta').length, 0);
      assert.equal(
        replay.events.find(event => event.type === 'finish').messageMetadata.runId,
        String(status.id),
      );
      assert.equal((await json(fixture, 'history', { conversationId })).messages.length, 2);
      const conflict = await request(fixture, 'send', { ...input, text: 'Changed text' });
      // SSE admission errors use the framework's non-JSON error response, before native headers.
      assert.equal(conflict.status, 409);
      assert.match(await conflict.text(), /409|Request key already used/);
      other = await createFixture();
      const forbidden = await request(other, 'history', { conversationId });
      assert.equal((await forbidden.json()).code, 404);
      const anonymousUrl = await context(async () =>
        app.util.getAbsoluteUrlByApiPath(`${root}history`),
      );
      const anonymous = await fetch(anonymousUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
      assert.equal((await anonymous.json()).code, 401);
      await json(fixture, 'remove', { conversationId });
      fixture.conversationIds = [];
    } finally {
      await removeFixture(other);
      await removeFixture(fixture);
    }
  });

  it('saves a first-turn title before closing the stream and keeps it on replay and later turns', async () => {
    let fixture: IFixture | undefined;
    try {
      fixture = await createFixture();
      const created = await json(fixture, 'create', {});
      fixture.conversationIds.push(created.id);
      const input = { conversationId: created.id, requestKey: randomUUID(), text: 'Order design' };
      const first = await readStream(await request(fixture, 'send', input));
      assert.equal(
        first.events.find(event => event.type === 'finish').messageMetadata.status,
        'completed',
      );
      const history = await json(fixture, 'history', { conversationId: created.id });
      const title = 'AI test response: Order design';
      assert.equal(history.conversation.title, title);
      const list = await json(fixture, 'list', {});
      assert.equal(list.find((item: any) => String(item.id) === String(created.id)).title, title);
      const replay = await readStream(await request(fixture, 'send', input));
      assert.equal(replay.events.filter(event => event.type === 'text-delta').length, 0);
      await readStream(
        await request(fixture, 'send', {
          ...input,
          requestKey: randomUUID(),
          text: 'A different topic',
        }),
      );
      assert.equal(
        (await json(fixture, 'history', { conversationId: created.id })).conversation.title,
        title,
      );
    } finally {
      await removeFixture(fixture);
    }
  });

  it('finishes a successful chat even when the separate title request fails', async () => {
    let fixture: IFixture | undefined;
    try {
      fixture = await createFixture();
      const created = await json(fixture, 'create', {});
      fixture.conversationIds.push(created.id);
      const input = { conversationId: created.id, requestKey: randomUUID(), text: '[title-error]' };
      const stream = await readStream(await request(fixture, 'send', input));
      assert.equal(
        stream.events.some(event => event.type === 'error'),
        false,
      );
      assert.equal(
        stream.events.find(event => event.type === 'finish').messageMetadata.status,
        'completed',
      );
      const history = await json(fixture, 'history', { conversationId: created.id });
      assert.equal(history.conversation.title, 'New conversation');
      assert.deepEqual(
        history.messages.map((message: any) => message.text),
        [input.text, `AI test response: ${input.text}`],
      );
      assert.equal((await json(fixture, 'status', input)).status, 'completed');
    } finally {
      await removeFixture(fixture);
    }
  });

  it('maps provider errors safely and excludes the incomplete turn from saved history', async () => {
    let fixture: IFixture | undefined;
    try {
      fixture = await createFixture();
      const conversationId = await conversation(fixture);
      const input = { conversationId, requestKey: randomUUID(), text: '[error]' };
      const stream = await readStream(await request(fixture, 'send', input));
      assert.equal(stream.events.find(event => event.type === 'error').errorText, 'chat_failed');
      assert.doesNotMatch(stream.text, /Test provider failure|stack|apiKey/);
      const status = await json(fixture, 'status', input);
      assert.equal(status.status, 'failed');
      assert.equal((await json(fixture, 'history', { conversationId })).messages.length, 0);
      await context(async () => {
        const usage = await scope().model.usage.get({ runId: status.id });
        assert.equal(usage?.inputTokens, null);
        assert.equal(usage?.outputTokens, null);
        const run = await scope().model.run.get({ id: status.id, userId: fixture!.userId });
        const messages = await scope().model.message.select({
          where: { runId: status.id, userId: fixture!.userId },
        });
        assert.ok(run);
        assert.equal(run.errorCode, 'chat_failed');
        assertNoCredential({ run, usage, messages });
        assert.doesNotMatch(
          JSON.stringify({ run, usage, messages }),
          /Test provider failure|stack/,
        );
      });
    } finally {
      await removeFixture(fixture);
    }
  });

  it('cancels on native response close and joins durable finalization before releasing the request context', async () => {
    let fixture: IFixture | undefined;
    try {
      fixture = await createFixture();
      const conversationId = await conversation(fixture);
      const input = { conversationId, requestKey: randomUUID(), text: '[slow] stop me' };
      const abort = new AbortController();
      const response = await request(fixture, 'send', input, abort.signal);
      const reader = response.body!.getReader();
      assert.equal((await reader.read()).done, false); // durable run metadata is available immediately
      abort.abort();
      await reader.cancel().catch(() => {});
      let status: any;
      const deadline = Date.now() + 10000;
      do {
        await delay(100);
        status = await json(fixture, 'status', input);
      } while (status?.status === 'running' && Date.now() < deadline);
      assert.equal(status.status, 'aborted');
      assert.equal(status.errorCode, 'chat_aborted');
      assert.equal((await json(fixture, 'history', { conversationId })).messages.length, 0);
      // The same server remains usable and a fresh turn is admitted after the claim is released.
      const next = await readStream(
        await request(fixture, 'send', { ...input, requestKey: randomUUID(), text: 'After stop' }),
      );
      assert.equal(
        next.events.find(event => event.type === 'finish').messageMetadata.status,
        'completed',
      );
    } finally {
      await removeFixture(fixture);
    }
  });
});
