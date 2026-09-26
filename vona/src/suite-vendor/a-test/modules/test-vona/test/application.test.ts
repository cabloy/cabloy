import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('application.test.ts', { concurrency: false, sequential: true }, () => {
  const fallbackHost = () => {
    const port = app.meta.env.SERVER_LISTEN_PORT;
    return port ? `localhost:${port}` : 'localhost';
  };

  it('uses the loopback fallback for requestless absolute URLs', () => {
    const host = fallbackHost();
    assert.equal(app.config.server.serve.protocol, '');
    assert.equal(app.config.server.serve.host, '');
    assert.equal(app.util.protocol, 'http');
    assert.equal(app.util.host, host);
    assert.equal(app.util.getAbsoluteUrl('/callback'), `http://${host}/callback`);
  });

  it('creates anonymous contexts from the listener origin', () => {
    const port = app.config.server.listen.port;
    const host = port ? `localhost:${port}` : 'localhost';
    const context = app.createAnonymousContext();
    assert.equal(context.host, host);
    assert.equal(context.hostname, 'localhost');
    assert.equal(context.protocol, 'http');
    assert.equal(context.secure, false);
  });

  it('keeps listener origin for nested anonymous contexts', async () => {
    const port = app.config.server.listen.port;
    const host = port ? `localhost:${port}` : 'localhost';
    const caller = app.createAnonymousContext({
      headers: { host: 'request.example.test' },
      method: 'GET',
      socket: { encrypted: true },
      url: '/',
    });
    await app.ctxStorage.run(caller, async () => {
      const context = app.createAnonymousContext();
      assert.equal(context.host, host);
      assert.equal(context.hostname, 'localhost');
      assert.equal(context.protocol, 'http');
      assert.equal(context.secure, false);
    });
  });

  it('preserves supplied requests and uses their origin when serve is unset', async () => {
    const request = {
      headers: { host: 'request.example.test' },
      method: 'GET',
      socket: { encrypted: true },
      url: '/',
    };
    const context = app.createAnonymousContext(request);
    assert.equal(context.req, request);
    assert.equal(context.host, 'request.example.test');
    assert.equal(context.protocol, 'https');
    assert.equal(context.secure, true);
    assert.equal(
      await app.ctxStorage.run(context, () => app.util.getAbsoluteUrl('/callback')),
      'https://request.example.test/callback',
    );
  });
});
