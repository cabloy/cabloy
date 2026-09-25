import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

describe('oauthRequestContext.test.ts', { concurrency: false }, () => {
  const releases: Array<() => void> = [];

  before(async () => {
    releases.push(await acquireTestLock('a-security'));
  });

  after(() => {
    for (const release of releases.reverse()) release();
  });
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

  it('logs rejected redirects against the canonical server origin', async () => {
    await app.bean.executor.mockCtx(async () => {
      const proxyPrevious = app.proxy;
      const serve = app.ctx.config.server.serve;
      const servePrevious = { ...serve };
      app.proxy = true;
      (serve as any).host = 'canonical.example.test';
      (serve as any).protocol = 'http';
      try {
        const req = {
          method: 'GET',
          url: '/api/auth/passport/callback',
          headers: {
            'host': 'origin.internal.test',
            'x-forwarded-host': 'edge.example.test',
            'x-forwarded-proto': 'https',
          },
          httpVersionMajor: 1,
          socket: {
            remoteAddress: '192.0.2.10',
            remotePort: 443,
          },
        };
        await app.bean.executor.newCtx(
          async () => {
            assert.equal(app.ctx.host, 'edge.example.test');
            assert.equal(app.ctx.protocol, 'https');
            assert.equal(app.util.host, 'canonical.example.test');
            assert.equal(app.util.protocol, 'http');

            const service = app.scope('a-auth').service.auth;
            const logger = (service as any).$logger;
            const warnPrevious = logger.warn;
            const warnings: unknown[][] = [];
            logger.warn = (...args: unknown[]) => warnings.push(args);
            try {
              (service as any)._logOauthRedirectRejected(
                {
                  id: -1,
                  providerName: 'auth-oauth:oauth',
                  clientName: 'github',
                },
                {
                  authProviderId: -1,
                  instanceName: app.ctx.instanceName!,
                  locale: app.ctx.locale,
                  redirect: 'https://edge.example.test/oauth/callback',
                },
                'origin_disallowed',
              );
            } finally {
              logger.warn = warnPrevious;
            }

            assert.equal(warnings.length, 1);
            assert.equal(warnings[0][0], 'OAuth callback final redirect rejected');
            const diagnostic = warnings[0][1] as Record<string, unknown>;
            assert.deepEqual(
              {
                event: diagnostic.event,
                stage: diagnostic.stage,
                outcome: diagnostic.outcome,
                reason: diagnostic.reason,
                requestHost: diagnostic.requestHost,
                requestProtocol: diagnostic.requestProtocol,
                serveHost: diagnostic.serveHost,
                serveProtocol: diagnostic.serveProtocol,
                proxyEnabled: diagnostic.proxyEnabled,
                redirectHost: diagnostic.redirectHost,
                hostMatches: diagnostic.hostMatches,
              },
              {
                event: 'auth.oauth_final_redirect_rejected',
                stage: 'redirect_validation',
                outcome: 'rejected',
                reason: 'origin_disallowed',
                requestHost: 'canonical.example.test',
                requestProtocol: 'http',
                serveHost: 'canonical.example.test',
                serveProtocol: 'http',
                proxyEnabled: true,
                redirectHost: 'edge.example.test',
                hostMatches: false,
              },
            );
          },
          {
            instanceName: app.ctx.instanceName!,
            req,
          },
        );
      } finally {
        app.proxy = proxyPrevious;
        Object.assign(serve, servePrevious);
      }
    });
  });
});
