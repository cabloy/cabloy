import type { TableIdentity } from 'table-identity';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import type { ILayoutProfile } from '../src/types/layoutprofile.ts';

const actionPath = '/layoutprofile';

function createTestId() {
  return randomUUID().slice(0, 12);
}

function createProfile(name: string): ILayoutProfile {
  return {
    version: 1,
    schemaFingerprint: `schema-${name}`,
    columns: [
      { key: 'name', visible: true, width: 'auto' },
      { key: 'level', visible: false, width: 180 },
    ],
  };
}

async function performAs(accessToken: string, method: string, path: string, options = {}) {
  return await app.bean.executor.newCtxIsolate(async () => {
    return await (app.bean.executor.performAction as any)(method, path, {
      ...options,
      authToken: accessToken,
      innerAccess: false,
    });
  });
}

async function registerAndSignin(name: string) {
  const user = await app.bean.user.register({ name }, true);
  const token = await app.bean.passport.signinMock(name as any);
  return { token: token.accessToken, user };
}

async function deleteOwnedProfiles(userIds: readonly TableIdentity[], layoutKey: string) {
  for (const userId of userIds) {
    await app.scope('a-layoutprofile').model.layoutprofile.delete({ userId, layoutKey });
  }
}

async function deleteOwnedUsers(userIds: readonly TableIdentity[]) {
  for (const userId of userIds) {
    await app.scope('home-user').model.roleUser.delete({ userId });
    await app.bean.user.removeById(userId);
  }
}

async function deleteOwnedTestData(userIds: readonly TableIdentity[], layoutKey: string) {
  await deleteOwnedProfiles(userIds, layoutKey);
  await deleteOwnedUsers(userIds);
}

describe('layoutprofile.test.ts', { concurrency: false }, () => {
  it('rejects anonymous profile operations', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const [method, path, options] of [
        ['get', `${actionPath}/load`, { query: { layoutKey: 'anonymous' } }],
        [
          'post',
          `${actionPath}/save`,
          { body: { layoutKey: 'anonymous', profile: createProfile('anonymous') } },
        ],
        ['delete', `${actionPath}/reset`, { query: { layoutKey: 'anonymous' } }],
      ] as const) {
        const [, error] = await catchError(() =>
          (app.bean.executor.performAction as any)(method, path, {
            ...options,
            innerAccess: false,
          }),
        );
        assert.equal(error?.code, 401);
      }
    });
  });

  it('isolates profiles by authenticated user and supports reset', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = createTestId();
      const layoutKey = `/training/student/${suffix}`;
      let userA: TableIdentity | undefined;
      let userB: TableIdentity | undefined;
      try {
        const customerA = await registerAndSignin(`layout-a-${suffix}`);
        const customerB = await registerAndSignin(`layout-b-${suffix}`);
        userA = customerA.user.id;
        userB = customerB.user.id;
        const profileA = createProfile('a');
        const profileAUpdated = {
          ...createProfile('a-updated'),
          columns: [{ key: 'name', visible: false, width: 320 }],
        } satisfies ILayoutProfile;
        const profileB = createProfile('b');

        assert.equal(
          await performAs(customerA.token, 'get', `${actionPath}/load`, {
            query: { layoutKey },
          }),
          undefined,
        );
        assert.deepEqual(
          await performAs(customerA.token, 'post', `${actionPath}/save`, {
            body: { layoutKey, profile: profileA },
          }),
          profileA,
        );
        const persistedA = await app.scope('a-layoutprofile').model.layoutprofile.get({
          userId: userA,
          layoutKey,
        });
        assert.equal(String(persistedA?.userId), String(userA));
        assert.deepEqual(persistedA?.profile, profileA);

        assert.equal(
          await performAs(customerB.token, 'get', `${actionPath}/load`, {
            query: { layoutKey },
          }),
          undefined,
        );
        assert.deepEqual(
          await performAs(customerB.token, 'post', `${actionPath}/save`, {
            body: { layoutKey, profile: profileB },
          }),
          profileB,
        );
        assert.deepEqual(
          await performAs(customerA.token, 'post', `${actionPath}/save`, {
            body: { layoutKey, profile: profileAUpdated },
          }),
          profileAUpdated,
        );
        const profilesA = await app.scope('a-layoutprofile').model.layoutprofile.select({
          where: { userId: userA, layoutKey },
        });
        assert.equal(profilesA.length, 1);
        assert.deepEqual(profilesA[0].profile, profileAUpdated);

        assert.deepEqual(
          await performAs(customerB.token, 'get', `${actionPath}/load`, {
            query: { layoutKey },
          }),
          profileB,
        );
        assert.equal(
          await performAs(customerB.token, 'delete', `${actionPath}/reset`, {
            query: { layoutKey },
          }),
          null,
        );
        assert.equal(
          await performAs(customerB.token, 'get', `${actionPath}/load`, {
            query: { layoutKey },
          }),
          undefined,
        );
        assert.deepEqual(
          await performAs(customerA.token, 'get', `${actionPath}/load`, {
            query: { layoutKey },
          }),
          profileAUpdated,
        );
      } finally {
        const userIds = [userA, userB].filter((id): id is TableIdentity => id !== undefined);
        await deleteOwnedTestData(userIds, layoutKey);
      }
    });
  });

  it('serializes competing first saves for one user and layout key', async () => {
    const suffix = createTestId();
    const layoutKey = `/layout-concurrency/${suffix}`;
    const fixture = await app.bean.executor.mockCtx(async () => {
      const customer = await registerAndSignin(`layout-concurrency-${suffix}`);
      return { token: customer.token, userId: customer.user.id };
    });
    const profiles = [createProfile('concurrency-a'), createProfile('concurrency-b')];
    try {
      const results = await Promise.allSettled(
        profiles.map(profile =>
          app.bean.executor.mockCtx(async () => {
            return await performAs(fixture.token, 'post', `${actionPath}/save`, {
              body: { layoutKey, profile },
            });
          }),
        ),
      );
      assert.equal(results.filter(result => result.status === 'fulfilled').length, profiles.length);

      const persisted = await app.bean.executor.mockCtx(async () => {
        return await app.scope('a-layoutprofile').model.layoutprofile.select({
          where: { userId: fixture.userId, layoutKey },
        });
      });
      assert.equal(persisted.length, 1);
      assert.ok(
        profiles.some(profile => JSON.stringify(profile) === JSON.stringify(persisted[0].profile)),
      );

      const loaded = await app.bean.executor.mockCtx(async () => {
        return await performAs(fixture.token, 'get', `${actionPath}/load`, {
          query: { layoutKey },
        });
      });
      assert.deepEqual(loaded, persisted[0].profile);
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await deleteOwnedTestData([fixture.userId], layoutKey);
      });
    }
  });

  it('validates the layout key and profile structure at the API boundary', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = createTestId();
      const customer = await registerAndSignin(`layout-validation-${suffix}`);
      const layoutKey = `/layout-validation/${suffix}`;
      try {
        for (const body of [
          { layoutKey: '', profile: createProfile('invalid-key') },
          { layoutKey, profile: { ...createProfile('version'), version: 2 } },
          {
            layoutKey,
            profile: {
              ...createProfile('width'),
              columns: [{ key: 'name', visible: true, width: 0 }],
            },
          },
          {
            layoutKey,
            profile: {
              ...createProfile('visible'),
              columns: [{ key: 'name', visible: 'yes', width: 'auto' }],
            },
          },
        ]) {
          const [, error] = await catchError(() =>
            performAs(customer.token, 'post', `${actionPath}/save`, { body }),
          );
          assert.equal(
            error?.code,
            422,
            `unexpected validation result for ${JSON.stringify(body)}: ${JSON.stringify(error)}`,
          );
        }
      } finally {
        await deleteOwnedTestData([customer.user.id], layoutKey);
      }
    });
  });
});
