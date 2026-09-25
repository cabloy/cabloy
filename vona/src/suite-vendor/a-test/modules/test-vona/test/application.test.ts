import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

describe('application.test.ts', { concurrency: false, sequential: true }, () => {
  let originalServe: { protocol?: string; host?: string };
  let originalProxy: boolean;
  let release: () => void;

  before(async () => {
    release = await acquireTestLock('vona-core:application');
    originalServe = { ...app.config.server.serve };
    originalProxy = app.proxy;
  });

  after(() => {
    Object.assign(app.config.server.serve, originalServe);
    app.proxy = originalProxy;
    release();
  });

  it('creates anonymous contexts from the effective origin', () => {
    app.proxy = false;
    (app.config.server.serve as any).protocol = 'https';
    (app.config.server.serve as any).host = 'api.example.test:7443';
    const configuredContext = app.createAnonymousContext();
    assert.equal(configuredContext.host, 'api.example.test:7443');
    assert.equal(configuredContext.hostname, 'api.example.test');
    assert.equal(configuredContext.protocol, 'https');
    assert.equal(configuredContext.secure, true);

    (app.config.server.serve as any).protocol = '';
    (app.config.server.serve as any).host = '';
    const fallbackContext = app.createAnonymousContext();
    const port = app.config.server.listen.port;
    const host = port ? `localhost:${port}` : 'localhost';
    assert.equal(fallbackContext.host, host);
    assert.equal(fallbackContext.hostname, 'localhost');
    assert.equal(fallbackContext.protocol, 'http');
    assert.equal(fallbackContext.secure, false);
  });

  it('inherits the current context origin when serve values are empty', async () => {
    app.proxy = true;
    (app.config.server.serve as any).protocol = '';
    (app.config.server.serve as any).host = '';
    const caller = app.createAnonymousContext({
      headers: {
        'host': 'internal.example.test',
        'x-forwarded-host': 'public.example.test:7443',
        'x-forwarded-proto': 'https',
      },
      method: 'GET',
      socket: {},
      url: '/',
    });
    await app.ctxStorage.run(caller, async () => {
      const context = app.createAnonymousContext();
      assert.equal(context.host, 'public.example.test:7443');
      assert.equal(context.hostname, 'public.example.test');
      assert.equal(context.protocol, 'https');
      assert.equal(context.secure, true);
    });
  });

  it('preserves supplied requests', () => {
    const request = {
      headers: { host: 'request.example.test' },
      method: 'GET',
      socket: {},
      url: '/',
    };
    const context = app.createAnonymousContext(request);
    assert.equal(context.req, request);
    assert.equal(context.host, 'request.example.test');
  });
});
