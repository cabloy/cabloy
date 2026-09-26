import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

describe('oauthRequestContext.test.ts', { concurrency: false }, () => {
  let release: () => void;

  before(async () => {
    release = await acquireTestLock('a-security');
  });

  after(() => {
    release();
  });

  it('passes the callback request through an isolated context without rewriting it', async () => {
    await app.bean.executor.mockCtx(async () => {
      const req = {
        method: 'GET',
        url: '/api/auth/passport/callback?a=1&b=2',
        headers: {
          'host': 'demo.example.test',
          'user-agent': 'oauth-callback-test',
        },
        httpVersionMajor: 1,
        socket: {
          encrypted: true,
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
    });
  });

  it('logs rejected redirects against the effective request origin', async () => {
    const req = {
      method: 'GET',
      url: '/api/auth/passport/callback',
      headers: {
        host: 'edge.example.test',
      },
      httpVersionMajor: 1,
      socket: {
        encrypted: true,
        remoteAddress: '192.0.2.10',
        remotePort: 443,
      },
    };
    await app.bean.executor.mockCtx(
      async () => {
        assert.equal(app.ctx.host, 'edge.example.test');
        assert.equal(app.ctx.protocol, 'https');
        assert.equal(app.util.host, 'edge.example.test');
        assert.equal(app.util.protocol, 'https');

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
              redirect: 'https://redirect.example.test/oauth/callback',
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
            requestHost: 'edge.example.test',
            requestProtocol: 'https',
            serveHost: null,
            serveProtocol: null,
            proxyEnabled: false,
            redirectHost: 'redirect.example.test',
            hostMatches: false,
          },
        );
      },
      { req },
    );
  });
});
