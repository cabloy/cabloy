import type { TableIdentity } from 'table-identity';
import type {
  DtoCustomScopeCreate,
  IMcpTokenPayload,
  IMcpAuthResource,
  IMcpToolIdentity,
  TypeMcpScope,
} from 'vona-module-mcp-auth';

import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import {
  getMcpIssuer,
  OAuthError,
  resolveMcpResource,
  resolveMcpInstance,
  sha256,
} from 'vona-module-mcp-auth';

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
  const release = await acquireTestLock('test-mcp');
  const users: UserFixture[] = [];
  const clients: string[] = [];
  let roleId: TableIdentity | undefined;
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
      ...(request.action.options.dataScope
        ? {
            terms: [
              { dataScope: 'mine' as const, ownerId: String(app.bean.passport.currentUser!.id) },
            ],
          }
        : {}),
    };
  });
  try {
    // Complete shared-instance startup before writing default-instance fixtures.
    await context(async () => {}, 'shareTest');
    await context(async () => {
      const role = await app.scope('home-user').model.role.insert({
        name: `mcp-custom-admin-${randomUUID()}`,
        title: 'Owned Student custom scope Admin admission',
        siteIds: ['admin'],
        builtin: false,
        mcpAccess: true,
      });
      roleId = role.id;
      for (const label of ['owner', 'other']) {
        const name = `mcp-custom-${label}-${randomUUID()}`;
        const user = await app.bean.user.register({ name }, true);
        // Track the user before creating dependent authentication fixtures.
        const fixture = { id: user.id, name } as UserFixture;
        users.push(fixture);
        const roles = await app.bean.role.findAllByUserId(user.id);
        await app.bean.role.replaceUserRoleIds(user.id, [
          ...(roles ?? []).map(role => role.id),
          role.id,
        ]);
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
          resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
        );
        clients.push(client.client_id);
      }
    });
    const catalog = await asUser(users[0], () => scopes().catalog(resource.resource));
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
      select: binding('training-student_student_select'),
      view: binding('training-student_student_view'),
      create: binding('training-student_student_create'),
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
        if (roleId !== undefined) await app.scope('home-user').model.role.deleteById(roleId);
      });
    } finally {
      release();
    }
  }
}

describe('customScope.test.ts', { concurrency: false }, () => {
  before(() => {
    resource = resolveMcpResource(app, new URL(getMcpIssuer(app)).host, 'admin');
  });

  it('keeps personal exact identities owner/instance scoped and resolves remembered custom scopes only after login', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const body = definition('Personal_reads', [fixture.select, fixture.select]);
      const owned = await asUser(fixture.owner, () =>
        scopes().createMine(fixture.owner.id, resource.resource, body),
      );
      assert.equal(owned.scope, 'mcp:custom:Personal_reads');
      assert.deepEqual(owned.tools, [fixture.select], 'deduplicate exact Action identities');
      await asUser(fixture.owner, async () => {
        assert.deepEqual(
          (await scopes().mine(fixture.owner.id, resource.resource)).list.map(row => row.scope),
          [owned.scope],
        );
        await expectOAuth(
          () =>
            scopes().createMine(
              fixture.owner.id,
              resource.resource,
              definition('Wrong-Action-binding', [{ ...fixture.select, action: 'create' }]),
            ),
          'invalid_scope',
        );
      });
      await asUser(fixture.other, async () => {
        assert.deepEqual((await scopes().mine(fixture.other.id, resource.resource)).list, []);
        await expectOAuth(
          () => scopes().resolve(fixture.other.id, resource.resource, owned.scope),
          'invalid_scope',
        );
        await assert.rejects(
          () => scopes().updateMine(fixture.other.id, resource.resource, owned.id, body),
          error => error instanceof Error && error.code === 404,
        );
        await scopes().deleteMine(fixture.other.id, resource.resource, owned.id);
      });
      await context(async () => {
        assert.deepEqual((await scopes().mine(fixture.owner.id, resource.resource)).list, []);
        await expectOAuth(
          () => scopes().resolve(fixture.owner.id, resource.resource, owned.scope),
          'invalid_scope',
        );
        await scopes().deleteMine(fixture.owner.id, resource.resource, owned.id);
      }, 'shareTest');
      // Anonymous intake accepts only format; owner resolution happens at authenticated summary/decision.
      const remembered = await request(fixture.clientId, owned.scope);
      await asUser(fixture.other, async () => {
        await expectOAuth(() => auth().summary(remembered), 'invalid_scope');
        await expectOAuth(() => auth().decide(remembered, true), 'invalid_scope');
      });
      await context(async () => {
        assert.equal((await grants().get({ requestDigest: sha256(remembered) }))?.state, 'pending');
        assert.deepEqual(
          (await scopes().resolve(fixture.owner.id, resource.resource, owned.scope)).tools,
          [fixture.select],
        );
      });
      await asUser(fixture.other, async () => {
        const other = await scopes().createMine(
          fixture.other.id,
          resource.resource,
          definition(body.name, [fixture.view]),
        );
        assert.notEqual(String(other.id), String(owned.id));
        assert.equal(other.scope, owned.scope, 'different owners can use the same public name');
        assert.deepEqual(
          (await scopes().resolve(fixture.other.id, resource.resource, other.scope)).tools,
          [fixture.view],
        );
        const summary = await auth().summary(remembered);
        assert.deepEqual(
          summary.options
            .find(option => option.scope === other.scope)
            ?.tools.map(tool => ({
              name: tool.name,
              controller: tool.controller,
              action: tool.action,
            })),
          [fixture.view],
          "the logged-in owner selects their own definition, not another owner's tools",
        );
      });
      const code = await approve(fixture, remembered);
      assert.equal((await redeem(fixture.clientId, code)).scope, owned.scope);
      await context(async () => {
        const row = await grants().get({ requestDigest: sha256(remembered) });
        assert.equal(String(row?.userId), String(fixture.owner.id));
        assert.deepEqual(row?.scopeTools, [fixture.select]);
      });
    });
  });

  it('trims case-preserved slug names and rejects invalid or duplicate owner names without changing rows', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      await asUser(fixture.owner, async () => {
        const owned = await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('  Personal_Reads-1  ', [fixture.select]),
        );
        assert.equal(owned.name, 'Personal_Reads-1');
        assert.equal(owned.scope, 'mcp:custom:Personal_Reads-1');
        const other = await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Another', [fixture.view]),
        );
        for (const name of [
          '',
          '   ',
          'two words',
          'has.dot',
          'has:colon',
          '中文',
          'a'.repeat(101),
        ]) {
          await expectOAuth(
            () =>
              scopes().createMine(
                fixture.owner.id,
                resource.resource,
                definition(name, [fixture.select]),
              ),
            'invalid_request',
          );
          await expectOAuth(
            () =>
              scopes().updateMine(
                fixture.owner.id,
                resource.resource,
                other.id,
                definition(name, [fixture.view]),
              ),
            'invalid_request',
          );
        }
        await expectOAuth(
          () =>
            scopes().createMine(
              fixture.owner.id,
              resource.resource,
              definition(' Personal_Reads-1 ', [fixture.view]),
            ),
          'invalid_request',
        );
        await expectOAuth(
          () =>
            scopes().updateMine(
              fixture.owner.id,
              resource.resource,
              other.id,
              definition(owned.name, [fixture.view]),
            ),
          'invalid_request',
        );
        const unchanged = await scopes().updateMine(
          fixture.owner.id,
          resource.resource,
          owned.id,
          definition(` ${owned.name} `, [fixture.select]),
        );
        assert.equal(
          unchanged.scope,
          owned.scope,
          'an unchanged name does not conflict with itself',
        );
        assert.deepEqual(
          (await scopes().mine(fixture.owner.id, resource.resource)).list
            .map(row => [row.name, row.scope])
            .toSorted(),
          [
            ['Another', 'mcp:custom:Another'],
            [owned.name, owned.scope],
          ].toSorted(),
          'rejected writes leave both owner definitions unchanged',
        );
        for (const name of ['a', 'A'.repeat(100), 'personal_reads-1']) {
          const valid = await scopes().createMine(
            fixture.owner.id,
            resource.resource,
            definition(name, [fixture.select]),
          );
          assert.equal(valid.name, name);
          assert.equal(valid.scope, `mcp:custom:${name}`);
          assert.equal(
            (await scopes().resolve(fixture.owner.id, resource.resource, valid.scope)).name,
            name,
          );
        }
        await expectOAuth(
          () =>
            scopes().resolve(fixture.owner.id, resource.resource, 'mcp:custom:PERSONAL_READS-1'),
          'invalid_scope',
        );
      });
    });
  });

  it('allows exactly one concurrent create for the same owner name across independent contexts', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const ready = Promise.withResolvers<void>();
      const contexts: unknown[] = [];
      const create = () =>
        asUser(fixture.owner, async () => {
          contexts.push(app.ctx);
          if (contexts.length === 2) ready.resolve();
          await ready.promise;
          return await scopes().createMine(
            fixture.owner.id,
            resource.resource,
            definition('Concurrent', [fixture.select]),
          );
        });
      const results = await Promise.allSettled([create(), create()]);
      assert.notEqual(
        contexts[0],
        contexts[1],
        'competing operations own separate mockCtx boundaries',
      );
      assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
      const rejected = results.filter(result => result.status === 'rejected');
      assert.equal(rejected.length, 1);
      assert.ok(rejected[0].reason instanceof OAuthError);
      assert.equal(rejected[0].reason.oauthError, 'invalid_request');
      await context(async () => {
        const rows = await app.scope('mcp-auth').model.customScope.select({
          where: { userId: fixture.owner.id, name: 'Concurrent' },
        });
        assert.equal(rows.length, 1, 'owner uniqueness is durable, not just a promise outcome');
        assert.equal(rows[0].scope, 'mcp:custom:Concurrent');
      });
    });
  });

  it('records all-to-custom attenuation and rejects read-to-write selection without consuming pending consent', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const [read, write, mixed] = await asUser(fixture.owner, async () => [
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Read-exact-subset', [fixture.select]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Write-exact-subset', [fixture.create]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Mixed-request-ceiling', [fixture.select, fixture.create]),
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
          const access = await auth().resolveToolAccess(
            fixture.owner.id,
            resource.resource,
            read.scope,
          );
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
          resource.resource,
          definition('Original-personal-subset', [fixture.select]),
        ),
      );
      const active = await issue(fixture, 'mcp:all', owned.scope);
      const codeRequest = await request(fixture.clientId, 'mcp:all');
      const unredeemed = await approve(fixture, codeRequest, owned.scope);
      await asUser(fixture.owner, async () => {
        const described = await scopes().updateMine(fixture.owner.id, resource.resource, owned.id, {
          name: owned.name,
          description: 'Metadata edit only',
          tools: [fixture.select],
        });
        assert.equal(described.scope, owned.scope);
        assert.equal(described.name, owned.name);
        assert.equal(described.description, 'Metadata edit only');
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
        assert.deepEqual(
          (await auth().resolveToolAccess(fixture.owner.id, resource.resource, owned.scope)).tools,
          [fixture.select],
        );
      });
      await asUser(fixture.owner, () =>
        scopes().updateMine(
          fixture.owner.id,
          resource.resource,
          owned.id,
          definition(owned.name, [fixture.select, fixture.view]),
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
      const deletionRequest = await request(fixture.clientId, 'mcp:all');
      const deletionCode = await approve(fixture, deletionRequest, owned.scope);
      await asUser(fixture.owner, () =>
        scopes().deleteMine(fixture.owner.id, resource.resource, owned.id),
      );
      await context(async () => {
        assert.equal(
          (await grants().get({ requestDigest: sha256(replacement.requestId) }))?.state,
          'revoked',
        );
        await expectOAuth(
          () => auth().lookupContext(replacement.token.access_token, resource.resource),
          'invalid_token',
        );
        await expectOAuth(
          () => scopes().resolve(fixture.owner.id, resource.resource, owned.scope),
          'invalid_scope',
        );
      });
      await expectOAuth(
        () => refresh(fixture.clientId, replacement.token.refresh_token!),
        'invalid_grant',
      );
      const recreated = await asUser(fixture.owner, () =>
        scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition(owned.name, [fixture.select, fixture.view]),
        ),
      );
      assert.notEqual(String(recreated.id), String(owned.id));
      assert.equal(recreated.scope, owned.scope, 'the same owner may reuse a deleted name');
      await context(async () => {
        await expectOAuth(
          () => auth().lookupContext(replacement.token.access_token, resource.resource),
          'invalid_token',
        );
        assert.equal(
          (await grants().get({ requestDigest: sha256(replacement.requestId) }))?.state,
          'revoked',
        );
      });
      await expectOAuth(() => redeem(fixture.clientId, deletionCode), 'invalid_grant');
      await expectOAuth(
        () => refresh(fixture.clientId, replacement.token.refresh_token!),
        'invalid_grant',
      );
      assert.equal((await issue(fixture, 'mcp:all', recreated.scope)).token.scope, recreated.scope);
    });
  });

  it('changes scope on rename and revokes effective and requested custom code/access/refresh grants', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const [broad, narrow, caseSibling] = await asUser(fixture.owner, async () => [
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Before-Rename', [fixture.select, fixture.view]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Narrow', [fixture.select]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('before-rename', [fixture.select]),
        ),
      ]);
      const unaffected = await issue(fixture, 'mcp:all', caseSibling.scope);
      const effective = await issue(fixture, 'mcp:all', broad.scope);
      const requested = await issue(fixture, broad.scope, narrow.scope);
      const effectiveRequest = await request(fixture.clientId, 'mcp:all');
      const effectiveCode = await approve(fixture, effectiveRequest, broad.scope);
      const requestedRequest = await request(fixture.clientId, broad.scope);
      const requestedCode = await approve(fixture, requestedRequest, narrow.scope);
      const pending = await request(fixture.clientId, broad.scope);
      const renamed = await asUser(fixture.owner, () =>
        scopes().updateMine(
          fixture.owner.id,
          resource.resource,
          broad.id,
          definition(' After_Rename ', [fixture.select, fixture.view]),
        ),
      );
      assert.equal(String(renamed.id), String(broad.id));
      assert.equal(renamed.name, 'After_Rename');
      assert.equal(renamed.scope, 'mcp:custom:After_Rename');
      assert.notEqual(renamed.scope, broad.scope);
      await context(async () => {
        await expectOAuth(
          () => scopes().resolve(fixture.owner.id, resource.resource, broad.scope),
          'invalid_scope',
        );
        assert.deepEqual(
          (await scopes().resolve(fixture.owner.id, resource.resource, renamed.scope)).tools,
          broad.tools,
        );
        for (const requestId of [
          effective.requestId,
          requested.requestId,
          effectiveRequest,
          requestedRequest,
        ]) {
          const row = await grants().get({ requestDigest: sha256(requestId) });
          assert.equal(row?.state, 'revoked');
          assert.equal(row?.codeDigest, '');
          assert.equal(row?.tokenDigest, '');
        }
        for (const issued of [effective, requested]) {
          await expectOAuth(
            () => auth().lookupContext(issued.token.access_token, resource.resource),
            'invalid_token',
          );
        }
      });
      for (const code of [effectiveCode, requestedCode]) {
        await expectOAuth(() => redeem(fixture.clientId, code), 'invalid_grant');
      }
      for (const issued of [effective, requested]) {
        assert.ok(issued.token.refresh_token);
        await expectOAuth(
          () => refresh(fixture.clientId, issued.token.refresh_token!),
          'invalid_grant',
        );
      }
      await asUser(fixture.owner, async () => {
        await expectOAuth(() => auth().summary(pending), 'invalid_scope');
        await expectOAuth(() => auth().decide(pending, true), 'invalid_scope');
      });
      assert.equal((await issue(fixture, 'mcp:all', renamed.scope)).token.scope, renamed.scope);
      await context(async () => {
        assert.equal(
          (await grants().get({ requestDigest: sha256(unaffected.requestId) }))?.state,
          'tokenActive',
        );
        assert.equal(
          (await auth().lookupContext(unaffected.token.access_token, resource.resource)).scope,
          caseSibling.scope,
        );
      });
      assert.ok(unaffected.token.refresh_token);
      assert.equal(
        (await refresh(fixture.clientId, unaffected.token.refresh_token)).scope,
        caseSibling.scope,
        'renaming a differently cased sibling does not revoke this family',
      );
    });
  });

  it('rejects noncanonical persisted definitions and old credentials but keeps the owner row manageable', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const owned = await asUser(fixture.owner, () =>
        scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Legacy-personal-subset', [fixture.select]),
        ),
      );
      const active = await issue(fixture, owned.scope);
      const codeRequest = await request(fixture.clientId, owned.scope);
      const code = await approve(fixture, codeRequest);
      const pending = await request(fixture.clientId, owned.scope);
      const legacyScope = `mcp:custom:${'L'.repeat(43)}` as const;
      const legacy = await context(async () => {
        // Model an already-persisted random identifier and its matching issued credentials.
        // Signing the matching payload proves rejection is canonical-definition validation,
        // rather than a mismatch between an otherwise-valid JWT and its grant row.
        await app.scope('mcp-auth').model.customScope.updateById(owned.id, { scope: legacyScope });
        for (const requestId of [active.requestId, codeRequest, pending]) {
          const row = await grants().get({ requestDigest: sha256(requestId) });
          assert.ok(row);
          await grants().updateById(row.id, { scope: legacyScope, requestedScope: legacyScope });
        }
        const verified = await app.bean.jwt.get('mcpAccess').verify(active.token.access_token);
        assert.ok(verified);
        const payload = app
          .scope('mcp-auth')
          .service.authTokenAdapter.payload(verified) as IMcpTokenPayload;
        payload.mcp.scope = legacyScope;
        return {
          access: await app.bean.jwt.get('mcpAccess').sign(payload),
          refresh: await app.bean.jwt.get('mcpRefresh').sign(payload),
        };
      });
      const all = await request(fixture.clientId, 'mcp:all');
      await asUser(fixture.owner, async () => {
        const mine = (await scopes().mine(fixture.owner.id, resource.resource)).list;
        assert.equal(mine.length, 1);
        assert.equal(String(mine[0].id), String(owned.id));
        assert.equal(mine[0].scope, legacyScope);
        const summary = await auth().summary(all);
        assert.equal(
          summary.options.some(option => option.scope === legacyScope),
          false,
        );
        await expectOAuth(() => auth().summary(pending), 'invalid_scope');
        await expectOAuth(() => auth().decide(pending, true), 'invalid_scope');
        await expectOAuth(
          () => scopes().resolve(fixture.owner.id, resource.resource, legacyScope),
          'invalid_scope',
        );
        await expectOAuth(
          () =>
            scopes().withDefinitions(
              fixture.owner.id,
              resource.resource,
              [legacyScope],
              async () => {
                assert.fail('noncanonical definitions must not reach the linking callback');
              },
            ),
          'invalid_scope',
        );
      });
      await context(async () => {
        await expectOAuth(
          () => auth().lookupContext(legacy.access, resource.resource),
          'invalid_token',
        );
        await expectOAuth(
          () => auth().resolveToolAccess(fixture.owner.id, resource.resource, legacyScope),
          'invalid_scope',
        );
      });
      await expectOAuth(() => redeem(fixture.clientId, code), 'invalid_grant');
      await expectOAuth(() => refresh(fixture.clientId, legacy.refresh), 'invalid_grant');
      await asUser(fixture.owner, async () => {
        const repaired = await scopes().updateMine(
          fixture.owner.id,
          resource.resource,
          owned.id,
          definition(owned.name, [fixture.select]),
        );
        assert.equal(
          repaired.scope,
          owned.scope,
          'the owner can explicitly repair a legacy definition',
        );
        await scopes().deleteMine(fixture.owner.id, resource.resource, owned.id);
        assert.deepEqual((await scopes().mine(fixture.owner.id, resource.resource)).list, []);
      });
    });
  });

  it('serializes definition linkage against deletion across independent contexts', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const owned = await asUser(fixture.owner, () =>
        scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Link-delete-contention', [fixture.select]),
        ),
      );
      const pending = await request(fixture.clientId, 'mcp:all');
      const entered = Promise.withResolvers<void>();
      const releaseLink = Promise.withResolvers<void>();
      const deleteStarted = Promise.withResolvers<void>();
      let linkContext: unknown;
      let deleteContext: unknown;
      let deleted = false;
      const linking = context(() =>
        scopes().withDefinitions(fixture.owner.id, resource.resource, [owned.scope], async () => {
          linkContext = app.ctx;
          entered.resolve();
          await releaseLink.promise;
          const row = await grants().get({ requestDigest: sha256(pending) });
          assert.ok(row);
          await grants().updateById(row.id, {
            userId: fixture.owner.id,
            authId: fixture.owner.authId,
            scope: owned.scope,
            scopeTools: [fixture.select],
            state: 'codeReady',
            codeDigest: sha256('owned-link-delete-code'),
            codeExpiresAt: Date.now() + 60000,
          });
        }),
      );
      let deletion: Promise<void> | undefined;
      try {
        await Promise.race([
          entered.promise,
          linking.then(() => assert.fail('link callback must run')),
        ]);
        deletion = context(async () => {
          deleteContext = app.ctx;
          deleteStarted.resolve();
          await scopes().deleteMine(fixture.owner.id, resource.resource, owned.id);
          deleted = true;
        });
        await deleteStarted.promise;
        await delay(50);
        assert.notEqual(linkContext, deleteContext);
        assert.equal(deleted, false, 'delete waits for the protected definition-link callback');
        releaseLink.resolve();
        await Promise.all([linking, deletion]);
        await context(async () => {
          assert.equal(await app.scope('mcp-auth').model.customScope.getById(owned.id), undefined);
          const row = await grants().get({ requestDigest: sha256(pending) });
          assert.equal(row?.state, 'revoked', 'delete sees and revokes the completed linkage');
          assert.equal(row?.codeDigest, '');
          await expectOAuth(
            () =>
              scopes().withDefinitions(
                fixture.owner.id,
                resource.resource,
                [owned.scope],
                async () => {
                  assert.fail('a deleted definition cannot link another grant');
                },
              ),
            'invalid_scope',
          );
        });
      } finally {
        releaseLink.resolve();
        await Promise.allSettled([linking, ...(deletion ? [deletion] : [])]);
      }
    });
  });

  it('revokes a narrowed grant when its requested custom definition changes', async () => {
    if (trainingDisabled) return;
    await withFixture(async fixture => {
      const [broad, narrow] = await asUser(fixture.owner, async () => [
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Requested-broad-subset', [fixture.select, fixture.view]),
        ),
        await scopes().createMine(
          fixture.owner.id,
          resource.resource,
          definition('Approved-narrow-subset', [fixture.select]),
        ),
      ]);
      const linked = await issue(fixture, broad.scope, narrow.scope);
      assert.equal(linked.token.scope, narrow.scope);
      await asUser(fixture.owner, () =>
        scopes().updateMine(
          fixture.owner.id,
          resource.resource,
          broad.id,
          definition(broad.name, [fixture.view]),
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
