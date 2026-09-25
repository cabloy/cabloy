import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('oauthRequestContext.test.ts', { concurrency: false }, () => {
  it('passes the callback request through an isolated context without rewriting it', async () => {
    await app.bean.executor.mockCtx(async () => {
      const proxyPrevious = app.proxy;
      app.proxy = true;
      try {
        const req = {
          method: 'GET',
          url: '/api/auth/passport/callback?a=1&b=2',
          headers: {
            'host': 'origin.internal.test',
            'x-forwarded-host': 'demo.example.test',
            'x-forwarded-proto': 'https',
            'user-agent': 'oauth-callback-test',
          },
          httpVersionMajor: 1,
          socket: {
            remoteAddress: '192.0.2.10',
            remotePort: 443,
          },
        };
        const originalUrl = req.url;
        const originalHeaders = { ...req.headers };
        const outerContext = app.ctx;
        const result = await app.bean.executor.newCtx(
          async () => {
            return {
              context: app.ctx,
              request: app.ctx.req,
              method: app.ctx.method,
              host: app.ctx.host,
              protocol: app.ctx.protocol,
              secure: app.ctx.secure,
              query: app.ctx.request.query,
              userAgent: app.ctx.get('user-agent'),
            };
          },
          {
            instanceName: outerContext.instanceName!,
            req,
          },
        );

        assert.notEqual(result.context, outerContext);
        assert.equal(result.request, req);
        assert.equal(result.method, 'GET');
        assert.equal(result.host, 'demo.example.test');
        assert.equal(result.protocol, 'https');
        assert.equal(result.secure, true);
        assert.deepEqual(result.query, { a: '1', b: '2' });
        assert.equal(result.userAgent, 'oauth-callback-test');
        assert.equal(req.url, originalUrl);
        assert.deepEqual(req.headers, originalHeaders);
        assert.equal(app.ctx, outerContext);
      } finally {
        app.proxy = proxyPrevious;
      }
    });
  });
});
