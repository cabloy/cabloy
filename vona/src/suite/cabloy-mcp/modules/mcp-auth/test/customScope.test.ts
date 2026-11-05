import type { TableIdentity } from 'table-identity';

import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

import type { DtoCustomScopeCreate } from '../src/dto/customScopeCreate.tsx';
import type { IMcpAuthResource, IMcpToolIdentity, TypeMcpScope } from '../src/types/index.ts';

import { getMcpIssuer, OAuthError, resolveMcpResource, sha256 } from '../src/lib/authorization.ts';

const trainingDisabled = (process.env.PROJECT_DISABLED_SUITES ?? '')
  .split(',')
  .includes('a-training');
const callback = 'https://custom-scope.example.test/callback';
const password = 'mcp-custom-scope-test-password';
const verifier = 's'.repeat(43);
const challenge = createHash('sha256').update(verifier).digest('base64url');
let resource: IMcpAuthResource;

interface UserFixture {
  id: TableIdentity;
  name: string;
  authId: TableIdentity;
  profileId: TableIdentity;
}
interface Fixture {
  owner: UserFixture;
  other: UserFixture;
  clientId: string;
  readClientId: string;
  select: IMcpToolIdentity;
  view: IMcpToolIdentity;
  create: IMcpToolIdentity;
}

function auth() {
  return app.scope('mcp-auth').service.authorization;
}
function scopes() {
  return app.scope('mcp-auth').service.customScope;
}
function grants() {
  return app.scope('mcp-auth').model.authorization;
}
function context<T>(operation: () => Promise<T>, instanceName = resource.instanceName) {
  return app.bean.executor.mockCtx(operation, { instanceName: instanceName as any });
}
async function asUser<T>(user: UserFixture, operation: () => Promise<T>): Promise<T> {
  return await context(async () => {
    await app.bean.auth.authenticate('auth-simple:simple', {
      clientOptions: { username: user.name, password },
      state: { intention: 'login' },
    });
    try {
      return await operation();
    } finally {
      await app.bean.passport.signout();
    }
  });
}
async function expectOAuth(operation: () => Promise<unknown>, code: string) {
  await assert.rejects(
    operation,
    error => error instanceof OAuthError && error.oauthError === code,
  );
}
function definition(name: string, tools: IMcpToolIdentity[]): DtoCustomScopeCreate {
  return { name, description: 'Owned custom scope regression', tools };
}
async function request(clientId: string, scope: TypeMcpScope) {
  return await context(() =>
    auth().authorize(
      new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: callback,
        resource: resource.resource,
        scope,
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      resource,
    ),
  );
}
async function approve(fixture: Fixture, requestId: string, scope?: TypeMcpScope) {
  const decision = await asUser(fixture.owner, () => auth().decide(requestId, true, scope));
  const code = new URL(decision.redirectUrl).searchParams.get('code');
  assert.ok(code);
  return code;
}
async function redeem(clientId: string, code: string) {
  return await context(() =>
    auth().exchange(
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: callback,
        resource: resource.resource,
        code_verifier: verifier,
      }),
      undefined,
    ),
  );
}
async function issue(
  fixture: Fixture,
  scope: TypeMcpScope,
  selected = scope,
  clientId = fixture.clientId,
) {
  const requestId = await request(clientId, scope);
  const code = await approve(fixture, requestId, selected);
  return { requestId, code, token: await redeem(clientId, code) };
}
async function refresh(clientId: string, token: string, scope?: TypeMcpScope) {
  return await context(() =>
    auth().exchange(
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: token,
        resource: resource.resource,
        ...(scope === undefined ? {} : { scope }),
      }),
      undefined,
    ),
  );
}
async function withFixture(operation: (fixture: Fixture) => Promise<void>) {
  const release = await acquireTestLock('mcp-test');
  const users: UserFixture[] = [];
  const clients: string[] = [];
  const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
    if (
      !users.some(user => String(user.id) === String(app.bean.passport.currentUser?.id)) ||
      app.ctx.instanceName !== resource.instanceName ||
      request.action.controllerBeanFullName !== 'training-student.controller.student'
    ) {
      return next();
    }
    return {
      allowed: ['select', 'view', 'create'].some(
        action => request.policyActionKey === `training-student.controller.student#${action}`,
      ),
      actionKey: request.action.actionKey,
      action: request.action,
    };
  });
  try {
    // Complete shared-instance startup before writing default-instance fixtures.
    await context(async () => {}, 'shareTest');
    await context(async () => {
      for (const label of ['owner', 'other']) {
        const name = `mcp-custom-${label}-${randomUUID()}`;
        const user = await app.bean.user.register({ name }, true);
        // Track the user before creating dependent authentication fixtures.
        const fixture = { id: user.id, name } as UserFixture;
        users.push(fixture);
        const profile = await app
          .scope('auth-simple')
          .service.authSimple.createForUser(user.id, password);
        assert.ok(profile);
        fixture.profileId = profile.id;
        const currentAuth = await app.scope('a-auth').model.auth.get({ userId: user.id });
        assert.ok(currentAuth);
        fixture.authId = currentAuth.id;
      }
      for (const scope of ['mcp:all', 'mcp:read']) {
        const client = await app.scope('mcp-auth').service.registration.register(
          {
            client_name: `Managed custom scope ${scope}`,
            redirect_uris: [callback],
            token_endpoint_auth_method: 'none',
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            scope,
          },
          resource,
        );
        clients.push(client.client_id);
      }
    });
    const catalog = await asUser(users[0], () => scopes().catalog());
    const binding = (name: string): IMcpToolIdentity => {
      const tool = catalog.find(tool => tool.name === name);
      assert.ok(tool, `${name} must be available from the real authorized compiler catalog`);
      return { name: tool.name, controller: tool.controller, action: tool.action };
    };
    await operation({
      owner: users[0],
      other: users[1],
      clientId: clients[0],
      readClientId: clients[1],
      select: binding('training_student_select'),
      view: binding('training_student_view'),
      create: binding('training_student_create'),
    });
  } finally {
    off();
    try {
      await context(async () => {
        for (const clientId of clients.toReversed()) {
          await grants().builderSelect().where({ oauthClientId: clientId }).delete();
        }
        for (const user of users.toReversed()) {
          await app
            .scope('mcp-auth')
            .model.customScope.builderSelect()
            .where({ userId: user.id })
            .delete();
        }
        for (const clientId of clients.toReversed()) {
          await app.scope('mcp-auth').model.client.delete({ oauthClientId: clientId });
        }
        for (const user of users.toReversed()) {
          if (user.authId !== undefined)
            await app.scope('a-auth').model.auth.deleteById(user.authId);
          if (user.profileId !== undefined)
            await app.scope('auth-simple').model.authSimple.deleteById(user.profileId);
          await app.scope('home-user').model.roleUser.delete({ userId: user.id });
          await app.bean.user.removeById(user.id);
        }
      });
    } finally {
      release();
    }
  }
}

describe('customScope.test.ts', { concurrency: false }, () => {
  before(() => {
    resource = resolveMcpResource(app, new URL(getMcpIssuer(app)).host);
  });

  it('keeps personal exact identities owner/instance scoped and resolves remembered custom scopes only after login', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const body = definition('Personal reads', [fixture.select, fixture.select]);
      const owned = await asUser(fixture.owner, () => scopes().createMine(fixture.owner.id, body));
      assert.match(owned.scope, /^mcp:custom:[\w-]{43}$/);
      assert.deepEqual(owned.tools, [fixture.select], 'deduplicate exact Action identities');
      await asUser(fixture.owner, async () => {
        assert.deepEqual(
          (await scopes().mine(fixture.owner.id)).list.map(row => row.scope),
          [owned.scope],
        );
        await expectOAuth(
          () =>
            scopes().createMine(
              fixture.owner.id,
              definition('Wrong Action binding', [{ ...fixture.select, action: 'create' }]),
            ),
          'invalid_scope',
        );
      });
      await asUser(fixture.other, async () => {
        assert.deepEqual((await scopes().mine(fixture.other.id)).list, []);
        await expectOAuth(() => scopes().resolve(fixture.other.id, owned.scope), 'invalid_scope');
        await assert.rejects(
          () => scopes().updateMine(fixture.other.id, owned.id, body),
          error => error instanceof Error && error.code === 404,
        );
        await scopes().deleteMine(fixture.other.id, owned.id);
      });
      await context(async () => {
        assert.deepEqual((await scopes().mine(fixture.owner.id)).list, []);
        await expectOAuth(() => scopes().resolve(fixture.owner.id, owned.scope), 'invalid_scope');
        await scopes().deleteMine(fixture.owner.id, owned.id);
      }, 'shareTest');
      // Anonymous intake accepts only format; owner resolution happens at authenticated summary/decision.
      const remembered = await request(fixture.clientId, owned.scope);
      await asUser(fixture.other, async () => {
        await expectOAuth(() => auth().summary(remembered), 'invalid_scope');
        await expectOAuth(() => auth().decide(remembered, true), 'invalid_scope');
      });
      await context(async () => {
        assert.equal((await grants().get({ requestDigest: sha256(remembered) }))?.state, 'pending');
        assert.deepEqual((await scopes().resolve(fixture.owner.id, owned.scope)).tools, [
          fixture.select,
        ]);
      });
      const code = await approve(fixture, remembered);
      assert.equal((await redeem(fixture.clientId, code)).scope, owned.scope);
    });
  });

  it('records all-to-custom attenuation and rejects read-to-write selection without consuming pending consent', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const [read, write, mixed] = await asUser(fixture.owner, async () => [
        await scopes().createMine(
          fixture.owner.id,
          definition('Read exact subset', [fixture.select]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          definition('Write exact subset', [fixture.create]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          definition('Mixed request ceiling', [fixture.select, fixture.create]),
        ),
      ]);
      const all = await issue(fixture, 'mcp:all', read.scope);
      assert.equal(all.token.scope, read.scope);
      await context(async () => {
        const row = await grants().get({ requestDigest: sha256(all.requestId) });
        assert.ok(row);
        assert.equal(row.requestedScope, 'mcp:all');
        assert.equal(row.scope, read.scope);
        assert.deepEqual(row.scopeTools, [fixture.select]);
        assert.equal(row.state, 'tokenActive');
      });
      // Check the request ceiling and the registered-client ceiling independently.
      for (const [clientId, requested, reason] of [
        [fixture.clientId, 'mcp:read', 'outside_requested_scope'],
        [fixture.readClientId, mixed.scope, 'outside_client_scope'],
      ] as const) {
        const pending = await request(clientId, requested);
        await asUser(fixture.owner, async () => {
          const summary = await auth().summary(pending);
          assert.equal(summary.scope, requested);
          const option = summary.options.find(option => option.scope === write.scope);
          assert.ok(option);
          assert.equal(option.allowed, false);
          assert.equal(option.reason, reason);
          assert.equal(summary.options.find(option => option.scope === read.scope)?.allowed, true);
          await expectOAuth(() => auth().decide(pending, true, write.scope), 'invalid_scope');
        });
        await context(async () => {
          const row = await grants().get({ requestDigest: sha256(pending) });
          assert.equal(row?.state, 'pending');
          assert.equal(row?.codeDigest, '');
        });
        const code = await approve(fixture, pending, read.scope);
        const token = await redeem(clientId, code);
        assert.equal(token.scope, read.scope);
        await context(async () => {
          const row = await grants().get({ requestDigest: sha256(pending) });
          assert.equal(Boolean(row?.scopeReadOnly), true);
          await auth().lookupContext(token.access_token, resource.resource);
          const access = await auth().resolveToolAccess(read.scope, fixture.owner.id);
          assert.deepEqual(access.tools, [fixture.select]);
          assert.equal(
            access.readOnly,
            true,
            'runtime retains the consent/client read-only ceiling',
          );
        });
      }
    });
  });

  it('preserves metadata-only grants, inherits refresh exactly and revokes linked code/access/refresh on tool edits or deletion', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const owned = await asUser(fixture.owner, () =>
        scopes().createMine(
          fixture.owner.id,
          definition('Original personal subset', [fixture.select]),
        ),
      );
      const active = await issue(fixture, 'mcp:all', owned.scope);
      const codeRequest = await request(fixture.clientId, 'mcp:all');
      const unredeemed = await approve(fixture, codeRequest, owned.scope);
      await asUser(fixture.owner, async () => {
        const renamed = await scopes().updateMine(fixture.owner.id, owned.id, {
          name: 'Renamed personal subset',
          description: 'Metadata edit only',
          tools: [fixture.select],
        });
        assert.equal(renamed.scope, owned.scope);
        assert.equal(renamed.name, 'Renamed personal subset');
        assert.equal(renamed.description, 'Metadata edit only');
      });
      await context(async () => {
        assert.equal(
          (await grants().get({ requestDigest: sha256(active.requestId) }))?.state,
          'tokenActive',
        );
        assert.equal(
          (await grants().get({ requestDigest: sha256(codeRequest) }))?.state,
          'codeReady',
        );
        assert.equal(
          (await auth().lookupContext(active.token.access_token, resource.resource)).scope,
          owned.scope,
        );
      });
      assert.ok(active.token.refresh_token);
      await expectOAuth(
        () => refresh(fixture.clientId, active.token.refresh_token!, 'mcp:all'),
        'invalid_scope',
      );
      await expectOAuth(
        () => refresh(fixture.clientId, active.token.refresh_token!, 'mcp:read'),
        'invalid_scope',
      );
      const inherited = await refresh(fixture.clientId, active.token.refresh_token);
      assert.equal(inherited.scope, owned.scope);
      assert.ok(inherited.refresh_token);
      await context(async () => {
        await auth().lookupContext(inherited.access_token, resource.resource);
        assert.deepEqual((await auth().resolveToolAccess(owned.scope, fixture.owner.id)).tools, [
          fixture.select,
        ]);
      });
      await asUser(fixture.owner, () =>
        scopes().updateMine(
          fixture.owner.id,
          owned.id,
          definition('Changed personal subset', [fixture.select, fixture.view]),
        ),
      );
      await context(async () => {
        for (const requestId of [active.requestId, codeRequest]) {
          const row = await grants().get({ requestDigest: sha256(requestId) });
          assert.equal(row?.state, 'revoked');
          assert.equal(row?.codeDigest, '');
          assert.equal(row?.tokenDigest, '');
        }
        await expectOAuth(
          () => auth().lookupContext(inherited.access_token, resource.resource),
          'invalid_token',
        );
      });
      await expectOAuth(() => redeem(fixture.clientId, unredeemed), 'invalid_grant');
      await expectOAuth(() => refresh(fixture.clientId, inherited.refresh_token!), 'invalid_grant');
      const replacement = await issue(fixture, 'mcp:all', owned.scope);
      assert.ok(replacement.token.refresh_token);
      await asUser(fixture.owner, () => scopes().deleteMine(fixture.owner.id, owned.id));
      await context(async () => {
        assert.equal(
          (await grants().get({ requestDigest: sha256(replacement.requestId) }))?.state,
          'revoked',
        );
        await expectOAuth(
          () => auth().lookupContext(replacement.token.access_token, resource.resource),
          'invalid_token',
        );
        await expectOAuth(() => scopes().resolve(fixture.owner.id, owned.scope), 'invalid_scope');
      });
      await expectOAuth(
        () => refresh(fixture.clientId, replacement.token.refresh_token!),
        'invalid_grant',
      );
    });
  });

  it('revokes a narrowed grant when its requested custom definition changes', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const [broad, narrow] = await asUser(fixture.owner, async () => [
        await scopes().createMine(
          fixture.owner.id,
          definition('Requested broad subset', [fixture.select, fixture.view]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          definition('Approved narrow subset', [fixture.select]),
        ),
      ]);
      const linked = await issue(fixture, broad.scope, narrow.scope);
      assert.equal(linked.token.scope, narrow.scope);
      await asUser(fixture.owner, () =>
        scopes().updateMine(
          fixture.owner.id,
          broad.id,
          definition('Requested definition edited', [fixture.view]),
        ),
      );
      await context(async () => {
        const row = await grants().get({ requestDigest: sha256(linked.requestId) });
        assert.equal(row?.requestedScope, broad.scope);
        assert.equal(row?.scope, narrow.scope);
        assert.equal(row?.state, 'revoked', 'requested custom linkage survives attenuation');
        await expectOAuth(
          () => auth().lookupContext(linked.token.access_token, resource.resource),
          'invalid_token',
        );
      });
    });
  });
});
