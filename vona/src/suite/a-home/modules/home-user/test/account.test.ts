import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
  'base64',
);

const currentPath = '/home/user/account/current';
const profilePath = '/home/user/account/profile';
const passwordChangePath = '/home/user/account/password/change';

interface IAccountFixture {
  userId: string;
  authId: string;
  authSimpleId: string;
  name: string;
}

describe('account.test.ts', { concurrency: false }, () => {
  it('uses the current Passport subject for profile updates and password changes', async () => {
    let fixture: IAccountFixture | undefined;
    try {
      fixture = await createFixture();

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, fixture!.name);
        try {
          const current = await app.bean.executor.performAction('get', currentPath, {
            innerAccess: false,
          });
          assert.equal(current.name, fixture!.name);
          assert.equal(current.displayName, undefined);
          assert.equal(current.hasSimpleAuth, true);
          assert.equal(current.canSendSetPasswordLink, false);

          const updated = await app.bean.executor.performAction('patch', profilePath, {
            innerAccess: false,
            body: {
              displayName: '  Updated display name  ',
              name: `${fixture!.name}-must-not-rename`,
              locale: 'en_us',
              tz: 'America/New_York',
              ignored: 'must-not-persist',
            },
          });
          assert.equal(updated.name, fixture!.name);
          assert.equal(updated.displayName, 'Updated display name');
          assert.equal(updated.locale, 'en-us');
          assert.equal(updated.tz, 'America/New_York');
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(fixture!.userId);
        assert.equal(user?.name, fixture!.name);
        assert.equal(user?.displayName, 'Updated display name');
        assert.ok(user);
        assert.equal('ignored' in user, false);
        assert.equal(
          await app.bean.user.findOneByName(`${fixture!.name}-must-not-rename`),
          undefined,
        );
      });

      await app.bean.executor.mockCtx(async () => {
        const jwt = await app.bean.auth.authenticate('auth-simple:simple', {
          clientName: 'default',
          state: { intention: 'login' },
          clientOptions: { username: fixture!.name, password: 'initial-password' },
        });
        assert.ok(jwt?.accessToken);
        try {
          const result = await app.bean.executor.performAction('post', passwordChangePath, {
            innerAccess: false,
            body: {
              currentPassword: 'initial-password',
              newPassword: 'updated-password',
              passwordConfirm: 'updated-password',
            },
          });
          assert.deepEqual(result, { requiresRelogin: true });
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const authSimple = app.scope('auth-simple').service.authSimple;
        assert.equal(
          await authSimple.verifyPassword(fixture!.userId, 'initial-password'),
          undefined,
        );
        assert.ok(await authSimple.verifyPassword(fixture!.userId, 'updated-password'));
      });
    } finally {
      if (fixture) await removeFixture(fixture);
    }
  });

  it('retains omitted displayName, clears null or blank, and validates the trimmed limit', async () => {
    let fixture: IAccountFixture | undefined;
    try {
      fixture = await createFixture();
      const displayName = 'd'.repeat(100);
      const updated = await updateProfile(fixture, { displayName: `  ${displayName}  ` });
      assert.equal(updated.displayName, displayName);
      assert.equal(updated.name, fixture.name);

      const retained = await updateProfile(fixture, { locale: 'en-us' });
      assert.equal(retained.displayName, displayName);

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10005 as any, fixture!.name);
        try {
          const account = app.scope('home-user').service.account;
          const result = await account.updateProfile({
            name: `${fixture!.name}-service-must-not-rename`,
          } as unknown as Parameters<typeof account.updateProfile>[0]);
          assert.equal(result.name, fixture!.name);
          assert.equal(result.displayName, displayName);
        } finally {
          await app.bean.passport.signout();
        }
      });

      for (const invalid of ['d'.repeat(101), `  ${'d'.repeat(101)}  `]) {
        await assert.rejects(
          () => updateProfile(fixture!, { displayName: invalid }),
          (error: { code?: number }) => error.code === 422,
        );
      }
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(fixture!.userId);
        assert.equal(user?.name, fixture!.name);
        assert.equal(user?.displayName, displayName);
      });

      for (const empty of [null, ' \t\n ', '']) {
        await updateProfile(fixture, { displayName: 'Before clearing' });
        const cleared = await updateProfile(fixture, { displayName: empty });
        assert.equal(cleared.name, fixture.name);
        assert.equal(cleared.displayName, undefined);
        await app.bean.executor.mockCtx(async () => {
          const user = await app.bean.user.findOneById(fixture!.userId);
          assert.ok(user);
          assert.ok(user.displayName == null);
          await app.bean.passport.signinSystem('mock', -10006 as any, fixture!.name);
          try {
            const current = await app.bean.executor.performAction('get', currentPath, {
              innerAccess: false,
            });
            assert.equal(current.displayName, undefined);
          } finally {
            await app.bean.passport.signout();
          }
        });
      }
    } finally {
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows two users to share displayName while retaining their original username logins', async () => {
    const fixtures: IAccountFixture[] = [];
    const displayName = `Shared ${crypto.randomUUID()}`;
    try {
      fixtures.push(await createFixture());
      fixtures.push(await createFixture());
      for (const fixture of fixtures) {
        const updated = await updateProfile(fixture, { displayName });
        assert.equal(updated.name, fixture.name);
        assert.equal(updated.displayName, displayName);
      }
      for (const fixture of fixtures) {
        await app.bean.executor.mockCtx(async () => {
          try {
            const jwt = await app.bean.auth.authenticate('auth-simple:simple', {
              clientName: 'default',
              state: { intention: 'login' },
              clientOptions: { username: fixture.name, password: 'initial-password' },
            });
            assert.ok(jwt?.accessToken);
            assert.equal(app.bean.passport.currentUser?.id.toString(), fixture.userId);
            const current = await app.bean.executor.performAction('get', currentPath, {
              innerAccess: false,
            });
            assert.equal(current.name, fixture.name);
            assert.equal(current.displayName, displayName);
          } finally {
            await app.bean.passport.signout();
          }
        });
      }
    } finally {
      for (const fixture of fixtures.reverse()) await removeFixture(fixture);
    }
  });

  it('accepts a freshly uploaded avatar during profile update', async () => {
    let fixture: IAccountFixture | undefined;
    let imageId: string | number | undefined;
    const imagePath = path.join(os.tmpdir(), `account-avatar-${crypto.randomUUID()}.png`);
    await fse.writeFile(imagePath, tinyPng);
    try {
      fixture = await createFixture();
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10004 as any, fixture!.name);
        try {
          const policy = await app.bean.imageUploadPolicy.resolveUploadPolicy({
            imageScene: 'home-user:homeUserAvatar',
            size: tinyPng.length,
            mimeType: 'image/png',
          });
          const uploaded = await app.bean.image.upload(
            policy.providerName,
            {
              file: imagePath,
              filename: 'avatar.png',
              contentType: policy.mimeType,
              public: policy.public,
            },
            {
              clientName: policy.clientName,
              imageScene: policy.imageScene,
              meta: policy.meta,
            },
          );
          imageId = uploaded.id;
          const uploadedResponse = await app.bean.image.createImageActionResponse(uploaded);
          const uploadedUrl = uploadedResponse.url;
          const reloaded = await app.scope('a-image').model.image.getById(imageId);
          assert.strictEqual(reloaded?.public, true);
          assert.strictEqual(typeof reloaded?.public, 'boolean');
          assert.equal(reloaded?.imageScene, 'home-user:homeUserAvatar');
          assert.equal(reloaded?.status, 'ready');
          assert.equal(reloaded?.meta?.ownerUserId, fixture!.userId);
          assert.equal(typeof uploadedUrl, 'string');
          const updated = await app.bean.executor.performAction('patch', profilePath, {
            innerAccess: false,
            body: {
              avatar: uploadedUrl,
            },
          });
          assert.equal(updated.avatar, uploadedUrl);
          assert.equal(typeof updated.avatar, 'string');

          const persisted = await app.scope('home-user').model.user.getById(fixture!.userId);
          assert.equal(persisted?.avatar, uploadedUrl);

          const preserved = await app.bean.executor.performAction('patch', profilePath, {
            innerAccess: false,
            body: {},
          });
          assert.equal(preserved.avatar, uploadedUrl);

          const thirdPartyAvatar = 'https://example.com/avatar.png';
          const thirdPartyUpdated = await app.bean.executor.performAction('patch', profilePath, {
            innerAccess: false,
            body: {
              avatar: thirdPartyAvatar,
            },
          });
          assert.equal(thirdPartyUpdated.avatar, thirdPartyAvatar);

          const cleared = await app.bean.executor.performAction('patch', profilePath, {
            innerAccess: false,
            body: { avatar: null },
          });
          assert.equal(cleared.avatar, undefined);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        if (imageId) await app.bean.image.delete(imageId);
      });
      if (fixture) await removeFixture(fixture);
      await fse.remove(imagePath);
    }
  });

  it('rejects an invalid current password without changing the credential', async () => {
    let fixture: IAccountFixture | undefined;
    try {
      fixture = await createFixture();
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10003 as any, fixture!.name);
        try {
          await assert.rejects(
            () =>
              app.bean.executor.performAction('post', passwordChangePath, {
                innerAccess: false,
                body: {
                  currentPassword: 'wrong-password',
                  newPassword: 'updated-password',
                  passwordConfirm: 'updated-password',
                },
              }),
            (error: { code?: number }) => error.code === 403,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        assert.ok(
          await app
            .scope('auth-simple')
            .service.authSimple.verifyPassword(fixture!.userId, 'initial-password'),
        );
      });
    } finally {
      if (fixture) await removeFixture(fixture);
    }
  });
});

async function updateProfile(fixture: IAccountFixture, body: Record<string, unknown>) {
  return await app.bean.executor.mockCtx(async () => {
    await app.bean.passport.signinSystem('mock', -10007 as any, fixture.name);
    try {
      return await app.bean.executor.performAction('patch', profilePath, {
        innerAccess: false,
        body,
      });
    } finally {
      await app.bean.passport.signout();
    }
  });
}

async function createFixture(): Promise<IAccountFixture> {
  return await app.bean.executor.mockCtx(async () => {
    const name = `account-test-${crypto.randomUUID()}`;
    const user = await app.bean.user.register({ name }, true);
    const authSimple = await app
      .scope('auth-simple')
      .service.authSimple.createForUser(user.id, 'initial-password');
    if (!authSimple) throw new Error('failed to create the test local credential');
    const provider = await app.bean.authProvider.get({
      providerName: 'auth-simple:simple',
      clientName: 'default',
    });
    const auth = await app.scope('a-auth').model.auth.get({
      userId: user.id,
      authProviderId: provider.id,
    });
    if (!auth) throw new Error('failed to create the test auth relation');
    return {
      userId: user.id.toString(),
      authId: auth.id.toString(),
      authSimpleId: authSimple.id.toString(),
      name,
    };
  });
}

async function removeFixture(fixture: IAccountFixture): Promise<void> {
  await app.bean.executor.mockCtx(async () => {
    await app.scope('a-auth').model.auth.deleteById(fixture.authId);
    await app.scope('auth-simple').model.authSimple.deleteById(fixture.authSimpleId);
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  });
}
