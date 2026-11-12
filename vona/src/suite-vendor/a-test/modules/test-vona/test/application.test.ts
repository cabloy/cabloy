import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AppUtil } from 'vona';
import { app } from 'vona-mock';

describe('application.test.ts', { concurrency: false }, () => {
  const fallbackHost = () => {
    const port = app.meta.env.SERVER_LISTEN_PORT;
    return port ? `localhost:${port}` : 'localhost';
  };

  const createUtil = (
    mode: 'dev' | 'test' | 'prod',
    serve = { protocol: '', host: '' },
    context?: {
      config: { server: { serve: typeof serve } };
      protocol: string;
      host: string;
    },
    port = '',
  ) => {
    const util = new AppUtil();
    Object.defineProperty(util, 'app', {
      value: {
        config: { server: { serve } },
        currentContext: context,
        meta: {
          isProd: mode === 'prod',
          isDev: mode === 'dev',
          isTest: mode === 'test',
          env: { SERVER_LISTEN_PORT: port },
        },
      },
    });
    return util;
  };

  it('requires each production serve field even with a request origin', () => {
    const configured = { protocol: 'https', host: 'public.example.test' };
    for (const field of ['protocol', 'host'] as const) {
      const serve = { ...configured, [field]: '' };
      for (const withContext of [false, true]) {
        const context = withContext
          ? { config: { server: { serve } }, protocol: 'http', host: 'request.example.test' }
          : undefined;
        const util = createUtil('prod', withContext ? configured : serve, context, '7102');
        const checkError = (error: unknown) => {
          assert(error instanceof Error);
          assert.equal(Object.getPrototypeOf(error), Error.prototype);
          assert(error.message.includes(`config.server.serve.${field}`));
          assert(error.message.includes(`SERVER_SERVE_${field.toUpperCase()}`));
          return true;
        };
        assert.throws(() => util[field], checkError);
        assert.throws(() => util.getAbsoluteUrl('/callback'), checkError);
        const otherField = field === 'protocol' ? 'host' : 'protocol';
        assert.equal(util[otherField], configured[otherField]);
      }
    }
  });

  it('uses complete production serve config and prefers context config over root config', () => {
    const serve = { protocol: 'https', host: 'public.example.test' };
    const util = createUtil('prod', serve);
    assert.equal(util.protocol, 'https');
    assert.equal(util.host, 'public.example.test');
    assert.equal(util.getAbsoluteUrl('/callback'), 'https://public.example.test/callback');

    const context = {
      config: { server: { serve: { protocol: 'https', host: 'instance.example.test' } } },
      protocol: 'http',
      host: 'request.example.test',
    };
    const scopedUtil = createUtil('prod', { ...serve, protocol: 'http' }, context);
    assert.equal(scopedUtil.getAbsoluteUrl('/callback'), 'https://instance.example.test/callback');
  });

  it('keeps per-field configured, request and requestless fallbacks in dev/test', () => {
    for (const mode of ['dev', 'test'] as const) {
      for (const protocol of ['', 'https']) {
        for (const host of ['', 'configured.example.test']) {
          const serve = { protocol, host };
          const context = {
            config: { server: { serve } },
            protocol: 'http',
            host: 'request.example.test',
          };
          const util = createUtil(mode, { protocol: 'https', host: 'root.example.test' }, context);
          assert.equal(util.protocol, protocol || 'http');
          assert.equal(util.host, host || 'request.example.test');
          assert.equal(
            util.getAbsoluteUrl('/callback'),
            `${protocol || 'http'}://${host || 'request.example.test'}/callback`,
          );
        }
      }
      for (const port of ['', '7102']) {
        const host = port ? `localhost:${port}` : 'localhost';
        const util = createUtil(mode, undefined, undefined, port);
        assert.equal(util.protocol, 'http');
        assert.equal(util.host, host);
        assert.equal(util.getAbsoluteUrl('/callback'), `http://${host}/callback`);
      }
    }
  });

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
    assert.equal(context.req.url, '/');
    assert.equal(context.url, '/');
    assert.equal(context.path, '/');
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
      url: '/callback?code=test',
    };
    const context = app.createAnonymousContext(request);
    assert.equal(context.req, request);
    assert.equal(context.req.url, '/callback?code=test');
    assert.equal(context.url, '/callback?code=test');
    assert.equal(context.path, '/callback');
    assert.equal(context.querystring, 'code=test');
    assert.equal(context.host, 'request.example.test');
    assert.equal(context.protocol, 'https');
    assert.equal(context.secure, true);
    assert.equal(
      await app.ctxStorage.run(context, () => app.util.getAbsoluteUrl('/callback')),
      'https://request.example.test/callback',
    );
  });
});
