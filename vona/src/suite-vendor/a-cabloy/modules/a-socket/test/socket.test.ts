import type { IncomingMessage } from 'node:http';

import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, describe, it } from 'node:test';
import { setTimeout } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import { WebSocket } from 'ws';

import { socketEventRecord } from '../src/types/socketEvent.ts';

describe('socket.test.ts', { concurrency: false, timeout: 15000 }, () => {
  let release: () => void;

  before(async () => {
    release = await acquireTestLock('a-security');
  });

  after(() => {
    release();
  });

  it('rejects a disallowed origin before event initialization without retaining the client', async () => {
    await withConnection(
      'https://socket-rejected.invalid',
      undefined,
      async (client, server, messages) => {
        await once(client, 'close');
        assert.equal(typeof server.sendEvent, 'undefined');
        assert.deepEqual(messages, []);
        await assertClientRemoved(server);
      },
    );
  });

  it('sends one ready event for an accepted connection and removes it on close', async () => {
    await withConnection(undefined, undefined, async (client, server, messages) => {
      if (!messages.length) await once(client, 'message');
      await app.bean.executor.mockCtx(async () => {
        const scope = app.scope('a-socket');
        assert.deepEqual(messages, [
          `${scope.config.eventPrefix}${JSON.stringify([socketEventRecord.sysReady, null])}`,
        ]);
        assert.equal(app.bean.socket.getClient(server.id), server);
        assert.ok(app.bean.socket.clientsNamespace[server.namespace]?.includes(server.id));
      });
      const closed = once(client, 'close');
      client.close();
      await closed;
      await assertClientRemoved(server);
      assert.equal(messages.length, 1);
    });
  });

  it('removes a client when passport initialization throws after event initialization', async () => {
    await withConnection(
      undefined,
      'invalid-socket-test-token',
      async (client, server, messages) => {
        await once(client, 'close');
        assert.equal(typeof server.sendEvent, 'function');
        assert.deepEqual(messages, []);
        await assertClientRemoved(server);
      },
    );
  });
});

async function withConnection(
  origin: string | undefined,
  passportCode: string | undefined,
  fn: (client: WebSocket, server: WebSocket, messages: string[]) => Promise<void>,
) {
  const address = app.server.address();
  assert.ok(address && typeof address !== 'string');
  const scope = app.scope('a-socket');
  const url = new URL(`http://127.0.0.1:${address.port}${scope.config.globalPrefix}/`);
  url.searchParams.set(scope.config.queryKey.instanceName, '');
  url.searchParams.set('socketTest', crypto.randomUUID());
  if (passportCode) url.searchParams.set(scope.config.queryKey.passportCode, passportCode);
  const requestUrl = `${url.pathname}${url.search}`;
  url.protocol = 'ws:';

  const connected = Promise.withResolvers<WebSocket>();
  let server: WebSocket | undefined;
  const onConnection = (ws: WebSocket, req: IncomingMessage) => {
    if (req.url !== requestUrl) return;
    server = ws;
    connected.resolve(ws);
  };
  app.wss.on('connection', onConnection);
  const client = new WebSocket(url, { origin, handshakeTimeout: 5000 });
  client.on('error', connected.reject);
  const messages: string[] = [];
  client.on('message', data => messages.push(data.toString()));
  try {
    await fn(client, await connected.promise, messages);
  } finally {
    app.wss.off('connection', onConnection);
    if (client.readyState !== WebSocket.CLOSED) {
      const closed = once(client, 'close');
      client.terminate();
      await closed;
    }
    if (server) {
      await app.bean.executor.mockCtx(async () => {
        app.bean.socket.removeClient(server!);
      });
    }
  }
}

async function assertClientRemoved(server: WebSocket) {
  await app.bean.executor.mockCtx(async () => {
    // The peer close event can arrive before asynchronous server-side exit hooks finish.
    for (let attempt = 0; attempt < 100 && app.bean.socket.getClient(server.id); attempt++) {
      await setTimeout(10);
    }
    assert.equal(app.bean.socket.getClient(server.id), undefined);
    assert.equal(app.bean.socket.clientsNamespace[server.namespace]?.includes(server.id), false);
  });
}
