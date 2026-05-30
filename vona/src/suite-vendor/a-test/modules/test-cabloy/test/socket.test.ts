import type { VonaApplication } from 'vona';

import { WebSocketClient } from '@cabloy/socket';
import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { $protocolKey } from 'vona';
import { app } from 'vona-mock';

describe('socket.test.ts', () => {
  it('action:socket', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await test(app);
      await app.bean.passport.signout();
    });
  });
});

async function test(app: VonaApplication) {
  const scopeSocket = app.scope('a-socket');
  const path = `${scopeSocket.config.globalPrefix}/xxx`;
  const code = await app.bean.passport.createTempAuthToken({ path });
  const url = `ws://${app.config.server.listen.hostname}:${app.config.server.listen.port}${path}?${$protocolKey('x-vona-passport-code')}=${code}`;
  return new Promise(resolve => {
    const ws = new WebSocketClient();
    ws.onReady = async () => {
      return await testReady(ws, resolve);
    };
    ws.onEvent = (_eventName, _data) => {};
    ws.onFallback = _event => {};
    ws.connect(url);
  });
}

async function testReady(ws: WebSocketClient, resolve: Function) {
  // performAction: success
  const res = await ws.performAction('get', '/api/test/auth/passport/isAuthenticated');
  assert.equal(res, true);
  // performAction: fail
  const [_, err] = await catchError(() => {
    return ws.performAction('get', '/__not_found_fail');
  });
  ws.disconnect();
  resolve(true);
  // should after resolve
  assert.equal(err?.code, 404);
}
