import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

import type {
  IMcpAuthConfig,
  IMcpAuthRegistrationRequest,
  IMcpAuthResource,
} from '../src/types/index.ts';

import { config as defaultConfig } from '../src/config/config.ts';
import {
  getMcpIssuer,
  OAuthError,
  resolveMcpResource,
  sha256,
  validateConfiguredRedirectUri,
} from '../src/lib/authorization.ts';

let resource: IMcpAuthResource;
const redirectUri = 'https://client.example.test/callback';

function service() {
  return app.scope('mcp-auth').service.registration;
}

function model() {
  return app.scope('mcp-auth').model.client;
}

const publicRequest: IMcpAuthRegistrationRequest = {
  client_name: 'Registration test client',
  redirect_uris: [redirectUri],
  token_endpoint_auth_method: 'none',
  grant_types: ['authorization_code'],
  response_types: ['code'],
};

describe('registration.test.ts', { concurrency: false }, () => {
  let release: (() => void) | undefined;
  let original: IMcpAuthConfig;
  const clientIds: string[] = [];

  before(async () => {
    release = await acquireTestLock('mcp-test');
    original = structuredClone(app.config.modules['mcp-auth']);
    Object.assign(app.config.modules['mcp-auth'], {
      ...defaultConfig(app),
      registration: {
        maxBodyBytes: 16384,
        maxRedirectUris: 4,
        rateLimit: 10,
        rateLimitWindow: 600,
      },
      pendingTtl: 600,
      codeTtl: 60,
      tokenTtl: 900,
    } satisfies IMcpAuthConfig);
    resource = resolveMcpResource(app, new URL(getMcpIssuer(app)).host);
  });

  after(async () => {
    try {
      await app.bean.executor.mockCtx(async () => {
        for (const clientId of clientIds) {
          await model().builderSelect().where({ clientId }).delete();
        }
      });
    } finally {
      Object.assign(app.config.modules['mcp-auth'], original);
      release?.();
    }
  });

  it('persists a public registration and resolves it across contexts', async () => {
    const response = await app.bean.executor.mockCtx(() =>
      service().register(publicRequest, resource),
    );
    clientIds.push(response.client_id);
    assert.match(response.client_id, /^[\w-]{43}$/);
    assert.equal(response.client_name, publicRequest.client_name);
    assert.deepEqual(response.redirect_uris, [redirectUri]);
    assert.equal(response.token_endpoint_auth_method, 'none');
    assert.deepEqual(response.grant_types, ['authorization_code']);
    assert.deepEqual(response.response_types, ['code']);
    assert.equal(response.scope, 'mcp:read');
    assert.equal('client_secret' in response, false);

    await app.bean.executor.mockCtx(async () => {
      const row = await model().get({ clientId: response.client_id });
      assert.ok(row);
      assert.equal(row.name, publicRequest.client_name);
      assert.equal(row.resource, resource.resource);
      assert.equal(row.scope, 'mcp:read');
      assert.equal(row.state, 'active');
      assert.equal(row.secretSha256, null);
      const resolved = await service().resolve(response.client_id, resource.resource);
      assert.equal(resolved?.clientId, response.client_id);
      assert.deepEqual(resolved?.redirectUris, [redirectUri]);
      assert.equal(await service().resolve('unregistered-client', resource.resource), undefined);
      assert.equal(
        await service().resolve(response.client_id, 'https://other.example.test/mcp'),
        undefined,
      );
    });

    await app.bean.executor.mockCtx(async () => {
      await service().disable(response.client_id);
      assert.equal(await service().resolve(response.client_id, resource.resource), undefined);
    });
  });

  it('rejects resource and tenant selectors instead of accepting caller-authored authority', async () => {
    const client = await app.bean.executor.mockCtx(() =>
      service().register(publicRequest, resource),
    );
    clientIds.push(client.client_id);
    await app.bean.executor.mockCtx(async () => {
      for (const binding of [
        { ...resource, resource: 'https://other.example.test/mcp' },
        { ...resource, instanceName: 'foreign' },
      ]) {
        await assert.rejects(
          () => service().register(publicRequest, binding),
          error => error instanceof OAuthError && error.oauthError === 'invalid_target',
        );
      }
    });
    await app.bean.executor.mockCtx(
      async () => {
        await assert.rejects(
          () => service().register(publicRequest, resource),
          error => error instanceof OAuthError && error.oauthError === 'invalid_target',
        );
        assert.equal(await service().resolve(client.client_id, resource.resource), undefined);
      },
      { instanceName: 'shareTest' as any },
    );
  });

  it('validates exact bounded metadata and rejects unsupported authority', async () => {
    const invalidRequests: Array<[string, unknown, string]> = [
      [
        'unknown field',
        { ...publicRequest, resource: resource.resource },
        'invalid_client_metadata',
      ],
      ['empty name', { ...publicRequest, client_name: '' }, 'invalid_client_metadata'],
      [
        'fragment redirect',
        { ...publicRequest, redirect_uris: ['https://client.example.test/callback#fragment'] },
        'invalid_redirect_uri',
      ],
      [
        'duplicate redirect',
        { ...publicRequest, redirect_uris: [redirectUri, redirectUri] },
        'invalid_redirect_uri',
      ],
      [
        'unsupported authentication',
        { ...publicRequest, token_endpoint_auth_method: 'client_secret_post' },
        'invalid_client_metadata',
      ],
      [
        'unsupported grant',
        { ...publicRequest, grant_types: ['refresh_token'] },
        'invalid_client_metadata',
      ],
      [
        'unsupported response',
        { ...publicRequest, response_types: ['token'] },
        'invalid_client_metadata',
      ],
      ['null grant metadata', { ...publicRequest, grant_types: null }, 'invalid_client_metadata'],
      [
        'nonloopback HTTP redirect',
        { ...publicRequest, redirect_uris: ['http://client.example.test/callback'] },
        'invalid_redirect_uri',
      ],
    ];
    for (const [, request, code] of invalidRequests) {
      await app.bean.executor.mockCtx(async () => {
        await assert.rejects(
          () => service().register(request as IMcpAuthRegistrationRequest, resource),
          error => error instanceof OAuthError && error.oauthError === code,
        );
      });
    }
    const rows = await app.bean.executor.mockCtx(() =>
      model().builderSelect().where({ resource: resource.resource }),
    );
    assert.deepEqual(rows.map(row => row.clientId).sort(), clientIds.toSorted());
  });

  it('allows loopback redirects by default and persists confidential secret digests', async () => {
    assert.equal(defaultConfig(app).allowLoopbackHttp, true);
    assert.equal(app.config.modules['mcp-auth'].allowLoopbackHttp, true);
    const loopback = await app.bean.executor.mockCtx(() =>
      service().register(
        { ...publicRequest, redirect_uris: ['http://127.0.0.1:43123/callback'] },
        resource,
      ),
    );
    clientIds.push(loopback.client_id);
    assert.equal(loopback.redirect_uris[0], 'http://127.0.0.1:43123/callback');

    const confidential = await app.bean.executor.mockCtx(() =>
      service().register(
        {
          ...publicRequest,
          client_name: `Confidential ${randomUUID()}`,
          token_endpoint_auth_method: 'client_secret_basic',
        },
        resource,
      ),
    );
    clientIds.push(confidential.client_id);
    assert.match(confidential.client_secret ?? '', /^[\w-]{43}$/);
    assert.equal(confidential.client_secret_expires_at, 0);
    await app.bean.executor.mockCtx(async () => {
      const row = await model().get({ clientId: confidential.client_id });
      assert.ok(row?.secretSha256);
      assert.equal(row.secretSha256, sha256(confidential.client_secret!));
      assert.notEqual(row.secretSha256, confidential.client_secret);
    });

    const config = app.config.modules['mcp-auth'] as IMcpAuthConfig;
    const allowLoopbackHttp = config.allowLoopbackHttp;
    try {
      config.allowLoopbackHttp = false;
      for (const redirect of [
        'http://localhost:43124/callback',
        'http://127.0.0.1:43124/callback',
        'http://[::1]:43124/callback',
      ]) {
        assert.throws(
          () => validateConfiguredRedirectUri(redirect, config.allowLoopbackHttp),
          OAuthError,
        );
      }
      // An HTTP backend itself becomes unavailable under the stricter policy,
      // before registration can reach redirect validation.
      const expectedError =
        new URL(resource.resource).protocol === 'http:' ? 'server_error' : 'invalid_redirect_uri';
      await app.bean.executor.mockCtx(async () => {
        await assert.rejects(
          () =>
            service().register(
              { ...publicRequest, redirect_uris: ['http://127.0.0.1:43124/callback'] },
              resource,
            ),
          error => error instanceof OAuthError && error.oauthError === expectedError,
        );
      });
    } finally {
      config.allowLoopbackHttp = allowLoopbackHttp;
    }
  });
});
