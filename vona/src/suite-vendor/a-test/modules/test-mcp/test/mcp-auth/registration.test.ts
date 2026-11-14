import type {
  IMcpAuthConfig,
  IMcpAuthRegistrationRequest,
  IMcpAuthResource,
} from 'vona-module-mcp-auth';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import {
  config as defaultConfig,
  getMcpIssuer,
  OAuthError,
  resolveMcpResource,
  resolveMcpInstance,
  sha256,
  validateConfiguredRedirectUri,
} from 'vona-module-mcp-auth';

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
    release = await acquireTestLock('test-mcp');
    original = structuredClone(app.config.modules['mcp-auth']);
    Object.assign(app.config.modules['mcp-auth'], {
      ...defaultConfig(),
      registration: {
        maxBodyBytes: 16384,
        maxRedirectUris: 4,
        rateLimit: 10,
        rateLimitWindow: 600,
      },
      pendingTtl: 600,
      codeTtl: 60,
      tokenTtl: 900,
      refreshTokenTtl: 604800,
    } satisfies IMcpAuthConfig);
    resource = resolveMcpResource(app, new URL(getMcpIssuer(app)).host, 'web');
  });

  after(async () => {
    try {
      await app.bean.executor.mockCtx(async () => {
        for (const clientId of clientIds) {
          await model().builderSelect().where({ oauthClientId: clientId }).delete();
        }
      });
    } finally {
      Object.assign(app.config.modules['mcp-auth'], original);
      release?.();
    }
  });

  it('persists default grants for a public registration and resolves it across contexts', async () => {
    const response = await app.bean.executor.mockCtx(() =>
      service().register(
        { ...publicRequest, grant_types: undefined },
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
      ),
    );
    clientIds.push(response.client_id);
    assert.match(response.client_id, /^[\w-]{43}$/);
    assert.equal(response.client_name, publicRequest.client_name);
    assert.deepEqual(response.redirect_uris, [redirectUri]);
    assert.equal(response.token_endpoint_auth_method, 'none');
    assert.deepEqual(response.grant_types, ['authorization_code']);
    assert.deepEqual(response.response_types, ['code']);
    assert.equal(response.scope, 'mcp:all');
    assert.equal('client_secret' in response, false);

    await app.bean.executor.mockCtx(async () => {
      const row = await model().get({ oauthClientId: response.client_id });
      assert.ok(row);
      assert.equal(row.name, publicRequest.client_name);
      assert.equal(row.issuer, getMcpIssuer(app));
      assert.equal(row.scope, 'mcp:all');
      assert.equal(row.state, 'active');
      assert.deepEqual(row.grantTypes, ['authorization_code']);
      assert.equal(row.secretSha256, null);
      assert.equal(row.oauthClientId, response.client_id);
      assert.notEqual(String(row.id), response.client_id);
      const resolved = await service().resolve(response.client_id, resource.resource);
      assert.equal(String(resolved?.id), String(row.id));
      assert.equal(resolved?.clientId, response.client_id);
      assert.equal(resolved?.scope, 'mcp:all');
      assert.deepEqual(resolved?.redirectUris, [redirectUri]);
      assert.equal(await service().resolve('unregistered-client', resource.resource), undefined);
      await assert.rejects(
        () => service().resolve(response.client_id, 'https://other.example.test/mcp'),
        error => error instanceof OAuthError && error.oauthError === 'invalid_target',
      );
      assert.deepEqual(
        (await service().resolve(response.client_id, `${getMcpIssuer(app)}/admin`))?.resources,
        [`${getMcpIssuer(app)}/admin`],
        'issuer registration resolves independently for another enabled site',
      );
    });

    await app.bean.executor.mockCtx(async () => {
      await service().disable(response.client_id);
      assert.equal(await service().resolve(response.client_id, resource.resource), undefined);
    });
  });

  it('stores explicit scopes canonically and preserves read-only registrations', async () => {
    for (const [scope, expected] of [
      [undefined, 'mcp:all'],
      ['mcp:read', 'mcp:read'],
      ['mcp:all', 'mcp:all'],
      ['mcp:all mcp:read', 'mcp:all'],
      ['mcp:read mcp:all', 'mcp:all'],
    ]) {
      const response = await app.bean.executor.mockCtx(() =>
        service().register(
          { ...publicRequest, application_type: 'native', scope },
          resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
        ),
      );
      clientIds.push(response.client_id);
      assert.equal(response.scope, expected);
      assert.equal('application_type' in response, false);
      await app.bean.executor.mockCtx(async () => {
        assert.equal((await model().get({ oauthClientId: response.client_id }))?.scope, expected);
        assert.equal(
          (await service().resolve(response.client_id, resource.resource))?.scope,
          expected,
        );
      });
    }
  });

  it('does not normalize invalid persisted registration scopes into authority', async () => {
    const response = await app.bean.executor.mockCtx(() =>
      service().register(
        { ...publicRequest, scope: 'mcp:read' },
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
      ),
    );
    clientIds.push(response.client_id);
    await app.bean.executor.mockCtx(async () => {
      for (const scope of ['', 'mcp:write', 'mcp:all mcp:read', 'mcp:read mcp:all']) {
        await model()
          .builderSelect()
          .where({ oauthClientId: response.client_id })
          .update({ scope });
        assert.equal(await service().resolve(response.client_id, resource.resource), undefined);
        assert.equal((await model().get({ oauthClientId: response.client_id }))?.scope, scope);
      }
    });
  });

  it('persists explicit refresh grants canonically without granting broader scope', async () => {
    for (const grant_types of [
      ['authorization_code', 'refresh_token'],
      ['refresh_token', 'authorization_code'],
    ] as const) {
      const response = await app.bean.executor.mockCtx(() =>
        service().register(
          {
            ...publicRequest,
            client_name: 'Codex-style test client',
            application_type: 'native',
            grant_types: [...grant_types],
            scope: 'mcp:read',
          },
          resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
        ),
      );
      clientIds.push(response.client_id);
      assert.deepEqual(response.grant_types, ['authorization_code', 'refresh_token']);
      assert.deepEqual(response.response_types, ['code']);
      assert.equal(response.scope, 'mcp:read');
      assert.equal('application_type' in response, false);
      assert.equal('refresh_token' in response, false);
      assert.equal('client_secret' in response, false);
      await app.bean.executor.mockCtx(async () => {
        const row = await model().get({ oauthClientId: response.client_id });
        assert.deepEqual(row?.grantTypes, ['authorization_code', 'refresh_token']);
        const resolved = await service().resolve(response.client_id, resource.resource);
        assert.deepEqual(resolved?.grantTypes, ['authorization_code', 'refresh_token']);
        assert.equal(resolved?.scope, 'mcp:read');
        assert.deepEqual(resolved?.resources, [resource.resource]);
      });
    }
  });

  it('rejects resource and tenant selectors instead of accepting caller-authored authority', async () => {
    const client = await app.bean.executor.mockCtx(() =>
      service().register(publicRequest, resolveMcpInstance(app, new URL(getMcpIssuer(app)).host)),
    );
    clientIds.push(client.client_id);
    await app.bean.executor.mockCtx(async () => {
      for (const binding of [
        {
          ...resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
          issuer: 'https://other.example.test/mcp',
        },
        { ...resolveMcpInstance(app, new URL(getMcpIssuer(app)).host), instanceName: 'foreign' },
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
          () =>
            service().register(
              publicRequest,
              resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
            ),
          error => error instanceof OAuthError && error.oauthError === 'invalid_target',
        );
        assert.equal(await service().resolve(client.client_id, resource.resource), undefined);
      },
      { instanceName: 'shareTest' as any },
    );
  });

  it('ignores unknown registration metadata without persisting, echoing or granting authority', async () => {
    const extensions = {
      client_uri: 'https://client.example.test/about',
      vendor_enabled: true,
      vendor_version: 1,
      vendor_optional: null,
      vendor_features: ['example'],
      vendor_options: { nested: { scope: 'mcp:all' } },
    };
    const response = await app.bean.executor.mockCtx(() =>
      service().register(
        {
          ...publicRequest,
          application_type: 'native',
          scope: 'mcp:read',
          ...extensions,
          resource: 'https://other.example.test/mcp',
          instanceName: 'shareTest',
          state: 'revoked',
          client_id: 'caller-authored-id',
          client_secret: 'caller-authored-secret',
        },
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
      ),
    );
    try {
      assert.equal(response.scope, 'mcp:read');
      assert.equal(response.token_endpoint_auth_method, 'none');
      assert.notEqual(response.client_id, 'caller-authored-id');
      for (const key of [
        ...Object.keys(extensions),
        'application_type',
        'resource',
        'instanceName',
        'state',
        'client_secret',
      ]) {
        assert.equal(Object.hasOwn(response, key), false, key);
      }
      await app.bean.executor.mockCtx(async () => {
        const row = await model().get({ oauthClientId: response.client_id });
        assert.ok(row);
        for (const key of Object.keys(extensions)) {
          assert.equal(Object.hasOwn(row, key), false, key);
        }
        assert.equal(row.issuer, getMcpIssuer(app));
        assert.equal(row.state, 'active');
        assert.equal(row.scope, 'mcp:read');
        assert.equal(row.secretSha256, null);
        const resolved = await service().resolve(response.client_id, resource.resource);
        assert.ok(resolved);
        assert.deepEqual(resolved.resources, [resource.resource]);
        assert.equal(resolved.scope, 'mcp:read');
        assert.equal(resolved.authentication, 'none');
      });
    } finally {
      await app.bean.executor.mockCtx(() =>
        model().builderSelect().where({ oauthClientId: response.client_id }).delete(),
      );
    }
  });

  it('validates recognized bounded metadata and rejects unsupported values', async () => {
    const invalidRequests: Array<[string, unknown, string]> = [
      ...['web', 'other', '', 'Native', ' native', 'native ', null, 1, true, [], {}].map(
        application_type =>
          [
            'invalid application type',
            { ...publicRequest, application_type },
            'invalid_client_metadata',
          ] as [string, unknown, string],
      ),
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
      ...[
        [],
        ['authorization_code', 'client_credentials'],
        ['authorization_code', 'authorization_code'],
        ['authorization_code', 'refresh_token', 'refresh_token'],
        'authorization_code',
      ].map(
        grant_types =>
          ['invalid grant set', { ...publicRequest, grant_types }, 'invalid_client_metadata'] as [
            string,
            unknown,
            string,
          ],
      ),
      ...[
        '',
        'mcp:write',
        'offline_access',
        'mcp:read offline_access',
        ' mcp:read',
        'mcp:all ',
        ' ',
        'mcp:read mcp:read',
        'mcp:all mcp:all',
        'mcp:all mcp:read mcp:read',
        'mcp:all  mcp:read',
        'mcp:all\tmcp:read',
        'mcp:read\nmcp:all',
        'mcp:all offline_access',
        null,
        ['mcp:read'],
      ].map(
        scope =>
          ['invalid scope metadata', { ...publicRequest, scope }, 'invalid_client_metadata'] as [
            string,
            unknown,
            string,
          ],
      ),
      [
        'nonloopback HTTP redirect',
        { ...publicRequest, redirect_uris: ['http://client.example.test/callback'] },
        'invalid_redirect_uri',
      ],
    ];
    for (const [, request, code] of invalidRequests) {
      await app.bean.executor.mockCtx(async () => {
        await assert.rejects(
          () =>
            service().register(
              request as IMcpAuthRegistrationRequest,
              resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
            ),
          error => error instanceof OAuthError && error.oauthError === code,
        );
      });
    }
    const rows = await app.bean.executor.mockCtx(() =>
      model()
        .builderSelect()
        .where({ issuer: getMcpIssuer(app) }),
    );
    assert.deepEqual(rows.map(row => row.oauthClientId).sort(), clientIds.toSorted());
  });

  it('allows loopback redirects by default and persists confidential secret digests', async () => {
    assert.equal(defaultConfig().allowLoopbackHttp, true);
    assert.equal(app.config.modules['mcp-auth'].allowLoopbackHttp, true);
    const loopback = await app.bean.executor.mockCtx(() =>
      service().register(
        { ...publicRequest, redirect_uris: ['http://127.0.0.1:43123/callback'] },
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
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
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
      ),
    );
    clientIds.push(confidential.client_id);
    assert.match(confidential.client_secret ?? '', /^[\w-]{43}$/);
    assert.equal(confidential.client_secret_expires_at, 0);
    await app.bean.executor.mockCtx(async () => {
      const row = await model().get({ oauthClientId: confidential.client_id });
      assert.ok(row?.secretSha256);
      assert.equal(row.secretSha256, sha256(confidential.client_secret!));
      assert.notEqual(row.secretSha256, confidential.client_secret);
    });

    const config = app.config.modules['mcp-auth'] as IMcpAuthConfig;
    const allowLoopbackHttp = config.allowLoopbackHttp;
    const issuerBinding = resolveMcpInstance(app, new URL(getMcpIssuer(app)).host);
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
              issuerBinding,
            ),
          error => error instanceof OAuthError && error.oauthError === expectedError,
        );
      });
    } finally {
      config.allowLoopbackHttp = allowLoopbackHttp;
    }
  });
});
