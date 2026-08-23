import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { createHash } from 'vona';
import { acquireTestLock, app } from 'vona-mock';

const currentPath = '/home/user/account/current';
const passwordSetIssuePath = '/home/user/account/password-set/issue';
const passwordSetConsumePath = '/home/user/account/password-set/consume';
const passwordSetConsumerUrl = 'https://account.example.test/home/user/password-set';
const passwordSetConsumerUrlDev = 'http://localhost:9000/home/user/password-set';

interface IAccountPasswordSetFixture {
  userId: string;
  name: string;
  email?: string;
}

describe('accountPasswordSet.test.ts', { concurrency: false, sequential: true }, () => {
  const releases: Array<() => void> = [];

  before(async () => {
    for (const scene of ['a-mail', 'a-security', 'home-user']) {
      releases.push(await acquireTestLock(scene));
    }
  });

  after(() => {
    for (const release of releases.reverse()) release();
  });

  it('issues to a typed email without binding it until password setup succeeds', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ email: false });
      restoreConfig = await configurePasswordSet();
      const candidateEmail = `${crypto.randomUUID()}@example.test`;

      await app.bean.executor.mockCtx(async () => {
        await signin(fixture!);
        try {
          const current = await app.bean.executor.performAction('get', currentPath, {
            innerAccess: false,
          });
          assert.equal(current.canSendSetPasswordLink, true);
          assert.equal(current.eligibleEmailMasked, undefined);
        } finally {
          await app.bean.passport.signout();
        }
      });

      const issued = await issuePasswordSetLink(fixture, passwordSetConsumerUrl, candidateEmail);
      const digest = await getDigest(issued.token);
      assert.deepEqual(await getPasswordSetState(digest), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: candidateEmail,
        pendingEmail: candidateEmail,
      });
      await assertUserEmail(fixture.userId, undefined);

      await consumePasswordSet(issued.token, 'first-local-password');
      await assertUserEmail(fixture.userId, candidateEmail);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('matches stored email case-insensitively and rejects mismatches without changing state', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    let sendCount = 0;
    try {
      fixture = await createFixture({ email: 'Set.Email@Example.Test' });
      restoreConfig = await configurePasswordSet();
      const issued = await issuePasswordSetLink(
        fixture,
        passwordSetConsumerUrl,
        'set.email@example.test',
      );
      assert.deepEqual(await getPasswordSetState(await getDigest(issued.token)), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: fixture.email!,
      });
      await app.bean.executor.mockCtx(async () => {
        await clearPasswordSetState(fixture!.userId);
      });

      mail.send = async () => {
        sendCount++;
      };
      await issuePasswordSetLinkRejected(
        fixture,
        passwordSetConsumerUrl,
        `${crypto.randomUUID()}@example.test`,
        403,
      );
      await assertNoPasswordSetState(fixture.userId);
      assert.equal(sendCount, 0);
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('requires a valid typed email before creating password-set state', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet();
      for (const email of [undefined, '', 'not-an-email']) {
        await issuePasswordSetLinkValidationRejected(fixture, passwordSetConsumerUrl, email);
        await assertNoPasswordSetState(fixture.userId);
      }
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('supersedes a pending candidate without binding either until the current token succeeds', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ email: false });
      restoreConfig = await configurePasswordSet();
      const firstCandidate = `${crypto.randomUUID()}@example.test`;
      const secondCandidate = `${crypto.randomUUID()}@example.test`;
      const first = await issuePasswordSetLink(fixture, passwordSetConsumerUrl, firstCandidate);
      const firstDigest = await getDigest(first.token);
      const second = await issuePasswordSetLink(fixture, passwordSetConsumerUrl, secondCandidate);
      const secondDigest = await getDigest(second.token);

      assert.equal(await getPasswordSetState(firstDigest), undefined);
      assert.deepEqual(await getPasswordSetState(secondDigest), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: secondCandidate,
        pendingEmail: secondCandidate,
      });
      await consumePasswordSetRejected(first.token);
      await assertUserEmail(fixture.userId, undefined);

      await consumePasswordSet(second.token, 'first-local-password');
      await assertUserEmail(fixture.userId, secondCandidate);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('does not bind a pending candidate when another scoped user owns it', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let owner: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ email: false });
      owner = await createFixture();
      restoreConfig = await configurePasswordSet();
      const issued = await issuePasswordSetLink(fixture, passwordSetConsumerUrl, owner.email!);

      await consumePasswordSetRejected(issued.token);
      await assertUserEmail(fixture.userId, undefined);
      await assertNoSimpleAuth(fixture.userId);
    } finally {
      restoreConfig?.();
      if (owner) await removeFixture(owner);
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows only one empty-email account to bind the same pending candidate concurrently', async () => {
    let first: IAccountPasswordSetFixture | undefined;
    let second: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      first = await createFixture({ email: false });
      second = await createFixture({ email: false });
      restoreConfig = await configurePasswordSet();
      const candidateEmail = `${crypto.randomUUID()}@example.test`;
      const firstIssued = await issuePasswordSetLink(first, passwordSetConsumerUrl, candidateEmail);
      const secondIssued = await issuePasswordSetLink(
        second,
        passwordSetConsumerUrl,
        candidateEmail,
      );

      const results = await Promise.allSettled([
        consumePasswordSet(firstIssued.token, 'first-local-password'),
        consumePasswordSet(secondIssued.token, 'first-local-password'),
      ]);
      assert.equal(results.filter(item => item.status === 'fulfilled').length, 1);
      assert.equal(results.filter(item => item.status === 'rejected').length, 1);

      const winner = results[0].status === 'fulfilled' ? first : second;
      const loser = results[0].status === 'fulfilled' ? second : first;
      await assertUserEmail(winner.userId, candidateEmail);
      await assertSimpleAuth(winner.userId, 'first-local-password');
      await assertUserEmail(loser.userId, undefined);
      await assertNoSimpleAuth(loser.userId);
    } finally {
      restoreConfig?.();
      if (second) await removeFixture(second);
      if (first) await removeFixture(first);
    }
  });

  it('rejects a pending candidate token when the account email changes before consumption', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ email: false });
      restoreConfig = await configurePasswordSet();
      const candidateEmail = `${crypto.randomUUID()}@example.test`;
      const issued = await issuePasswordSetLink(fixture, passwordSetConsumerUrl, candidateEmail);
      const replacementEmail = `${crypto.randomUUID()}@example.test`;
      await setUserEmail(fixture.userId, replacementEmail);

      await consumePasswordSetRejected(issued.token);
      await assertUserEmail(fixture.userId, replacementEmail);
      await assertNoSimpleAuth(fixture.userId);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('rolls back the first credential when pending email persistence fails', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    let restoreUpdateById: (() => void) | undefined;
    let authId: string | number | undefined;
    let authSimpleId: string | undefined;
    try {
      fixture = await createFixture({ email: false });
      restoreConfig = await configurePasswordSet();
      const issued = await issuePasswordSetLink(
        fixture,
        passwordSetConsumerUrl,
        `${crypto.randomUUID()}@example.test`,
      );
      const provider = await app.bean.executor.mockCtx(async () => {
        return await app.bean.authProvider.get({
          providerName: 'auth-simple:simple',
          clientName: 'default',
        });
      });
      const userModel = app.scope('home-user').model.user as any;
      const hadOwnUpdateById = Object.hasOwn(userModel, 'updateById');
      const updateById = userModel.updateById;
      restoreUpdateById = () => {
        if (hadOwnUpdateById) {
          userModel.updateById = updateById;
        } else {
          delete userModel.updateById;
        }
      };
      userModel.updateById = async () => {
        const auth = await app.scope('a-auth').model.auth.get({
          userId: fixture!.userId,
          authProviderId: provider.id,
        });
        assert.ok(auth);
        authId = auth.id;
        authSimpleId = auth.profileId;
        assert.ok(
          await app.scope('auth-simple').model.authSimple.get({
            id: auth.profileId,
          }),
        );
        throw new Error('password-set user update failure');
      };

      await assert.rejects(
        () => consumePasswordSet(issued.token, 'first-local-password'),
        /password-set user update failure/,
      );

      restoreUpdateById();
      restoreUpdateById = undefined;
      assert.ok(authId);
      assert.ok(authSimpleId);
      await app.bean.executor.mockCtx(async () => {
        assert.equal(
          await app
            .scope('a-auth')
            .model.auth.get({ id: authId! }, { disableCacheEntity: true, disableCacheQuery: true }),
          undefined,
        );
        assert.equal(
          await app
            .scope('auth-simple')
            .model.authSimple.get(
              { id: authSimpleId! },
              { disableCacheEntity: true, disableCacheQuery: true },
            ),
          undefined,
        );
      });
      await assertNoSimpleAuth(fixture.userId);
      await assertUserEmail(fixture.userId, undefined);
    } finally {
      restoreUpdateById?.();
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('issues one digest-backed link, supersedes it, and consumes only the current token', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet();
      const first = await issuePasswordSetLink(fixture);
      assert.match(first.token, /^[0-9a-f-]{36}$/);
      assert.deepEqual(
        { origin: first.origin, path: first.path, hash: first.hash },
        { origin: 'https://account.example.test', path: '/home/user/password-set', hash: '' },
      );
      assert.equal(first.search, `?token=${first.token}`);
      const firstDigest = await getDigest(first.token);
      assert.deepEqual(await getPasswordSetState(firstDigest), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: fixture.email!,
      });
      assert.equal((await getCurrentDigest(fixture.userId)) === firstDigest, true);
      assert.ok(await getPasswordSetTtl(firstDigest));
      assert.ok(await getCurrentDigestTtl(fixture.userId));

      const second = await issuePasswordSetLink(fixture);
      const secondDigest = await getDigest(second.token);
      assert.equal(await getPasswordSetState(firstDigest), undefined);
      assert.deepEqual(await getPasswordSetState(secondDigest), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: fixture.email!,
      });
      assert.equal((await getCurrentDigest(fixture.userId)) === secondDigest, true);

      await consumePasswordSetRejected(first.token);
      assert.deepEqual(await getPasswordSetState(secondDigest), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: fixture.email!,
      });

      const result = await consumePasswordSet(second.token, 'first-local-password');
      assert.deepEqual(result, { requiresRelogin: true });
      await assertNoPasswordSetState(fixture.userId, secondDigest);

      await app.bean.executor.mockCtx(async () => {
        assert.ok(
          await app
            .scope('auth-simple')
            .service.authSimple.verifyPassword(fixture!.userId, 'first-local-password'),
        );
      });
      await consumePasswordSetRejected(second.token);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('preserves a trusted frontend consumer pathname', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet();

      const issued = await issuePasswordSetLink(
        fixture,
        'https://account.example.test/portal/account-security/set-password',
      );
      assert.deepEqual(
        { origin: issued.origin, path: issued.path, hash: issued.hash },
        {
          origin: 'https://account.example.test',
          path: '/portal/account-security/set-password',
          hash: '',
        },
      );
      assert.equal(issued.search, `?token=${issued.token}`);
      assert.deepEqual(await getPasswordSetState(await getDigest(issued.token)), {
        purpose: 'password-set',
        userId: fixture.userId,
        consumerPath: '/home/user/password-set',
        email: fixture.email!,
      });
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('rejects unsafe consumer URLs before creating password-set state', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet();

      for (const consumerUrl of [
        'https://account.example.test/home/user/password-set?next=/other',
        'https://account.example.test/home/user/password-set?token=attacker',
        'https://account.example.test/home/user/password-set#token=attacker',
        'https://user@account.example.test/home/user/password-set',
        'https://account.example.test:444/home/user/password-set',
        'https://evil.account.example.test/home/user/password-set',
        '/home/user/password-set',
        'not a URL',
        'javascript:alert(1)',
        'file:///home/user/password-set',
        'https://user:password@account.example.test/home/user/password-set',
        'https:\\account.example.test/home/user/password-set',
      ]) {
        await issuePasswordSetLinkRejected(fixture, consumerUrl);
        await assertNoPasswordSetState(fixture.userId);
      }
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('rejects consumer URLs when normal CORS uses a wildcard', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet('*');

      await issuePasswordSetLinkRejected(fixture, passwordSetConsumerUrl);
      await assertNoPasswordSetState(fixture.userId);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows an exact same-origin consumer without a whitelist entry', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet([]);

      const sameOriginConsumerUrl = await app.bean.executor.mockCtx(async () => {
        return `${app.ctx.protocol}://${app.ctx.host}/home/user/password-set`;
      });
      const issued = await issuePasswordSetLink(fixture, sameOriginConsumerUrl);
      assert.equal(issued.origin, new URL(sameOriginConsumerUrl).origin);
      assert.equal(issued.path, '/home/user/password-set');
      assert.equal(issued.search, `?token=${issued.token}`);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows a local Web origin for a loopback API in test mode', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet([]);

      const issued = await issuePasswordSetLink(fixture, passwordSetConsumerUrlDev);
      assert.deepEqual(
        { origin: issued.origin, path: issued.path, hash: issued.hash },
        { origin: 'http://localhost:9000', path: '/home/user/password-set', hash: '' },
      );
      assert.equal(issued.search, `?token=${issued.token}`);
      assert.ok(await getCurrentDigest(fixture.userId));
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows only one concurrent public token consumer', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet();
      const { token } = await issuePasswordSetLink(fixture);

      const results = await Promise.allSettled([
        consumePasswordSet(token, 'first-local-password'),
        consumePasswordSet(token, 'first-local-password'),
      ]);
      assert.equal(results.filter(item => item.status === 'fulfilled').length, 1);
      assert.equal(results.filter(item => item.status === 'rejected').length, 1);

      await app.bean.executor.mockCtx(async () => {
        const authSimple = app.scope('auth-simple').service.authSimple;
        assert.equal(await authSimple.hasByUserId(fixture!.userId), true);
        assert.ok(await authSimple.verifyPassword(fixture!.userId, 'first-local-password'));
      });
      await assertNoPasswordSetState(fixture.userId, await getDigest(token));
      await consumePasswordSetRejected(token);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('removes newly issued state when durable mail queueing fails', async () => {
    let fixture: IAccountPasswordSetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      fixture = await createFixture();
      restoreConfig = await configurePasswordSet();
      mail.send = async () => {
        throw new Error('mail queue unavailable');
      };

      await app.bean.executor.mockCtx(async () => {
        await signin(fixture!);
        try {
          await assert.rejects(
            () =>
              app.bean.executor.performAction('post', passwordSetIssuePath, {
                innerAccess: false,
                body: { email: fixture!.email!, consumerUrl: passwordSetConsumerUrl },
              }),
            /mail queue unavailable/,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });

      await assertNoPasswordSetState(fixture.userId);
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });
});

async function createFixture(
  options: { email?: false | string } = {},
): Promise<IAccountPasswordSetFixture> {
  return await app.bean.executor.mockCtx(async () => {
    const name = `account-password-set-test-${crypto.randomUUID()}`;
    const email =
      options.email === false ? undefined : options.email || `${crypto.randomUUID()}@example.test`;
    const user = await app.bean.user.register({ name, email }, true);
    return {
      userId: user.id.toString(),
      name,
      email,
    };
  });
}

async function configurePasswordSet(
  whiteList: string | string[] = ['https://account.example.test'],
) {
  return await app.bean.executor.mockCtx(async () => {
    const options =
      app.bean.onion.middlewareSystem.getOnionSlice('a-security:cors').beanOptions.options;
    const whiteListPrevious = options.whiteList;
    options.whiteList = Array.isArray(whiteList) ? [...whiteList] : whiteList;
    return () => {
      options.whiteList = whiteListPrevious;
    };
  });
}

async function removeFixture(fixture: IAccountPasswordSetFixture): Promise<void> {
  await app.bean.executor.mockCtx(async () => {
    await clearPasswordSetState(fixture.userId);
    const provider = await app.bean.authProvider.get({
      providerName: 'auth-simple:simple',
      clientName: 'default',
    });
    const auth = await app.scope('a-auth').model.auth.get({
      userId: fixture.userId,
      authProviderId: provider.id,
    });
    if (auth) {
      await app.scope('a-auth').model.auth.deleteById(auth.id);
      await app.scope('auth-simple').model.authSimple.deleteById(auth.profileId);
    }
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  });
}

async function issuePasswordSetLink(
  fixture: IAccountPasswordSetFixture,
  consumerUrl = passwordSetConsumerUrl,
  email = fixture.email || `${crypto.randomUUID()}@example.test`,
) {
  let text: unknown;
  const mail = app.bean.mail;
  const send = mail.send;
  mail.send = async options => {
    text = options.text;
  };
  try {
    await app.bean.executor.mockCtx(async () => {
      await signin(fixture);
      try {
        await app.bean.executor.performAction('post', passwordSetIssuePath, {
          innerAccess: false,
          body: { email, consumerUrl },
        });
      } finally {
        await app.bean.passport.signout();
      }
    });
  } finally {
    mail.send = send;
  }
  if (typeof text !== 'string') throw new Error('password-set email text not found');
  const link = text.trim().split('\n').at(-1)?.trim();
  if (!link) throw new Error('password-set link not found');
  const url = new URL(link);
  const token = url.searchParams.get('token');
  if (!token) throw new Error('password-set token not found');
  return { origin: url.origin, path: url.pathname, search: url.search, hash: url.hash, token };
}

async function issuePasswordSetLinkRejected(
  fixture: IAccountPasswordSetFixture,
  consumerUrl: string,
  email = fixture.email || `${crypto.randomUUID()}@example.test`,
  expectedCode = 503,
) {
  await app.bean.executor.mockCtx(async () => {
    await signin(fixture);
    try {
      await assert.rejects(
        () =>
          app.bean.executor.performAction('post', passwordSetIssuePath, {
            innerAccess: false,
            onions: {
              interceptor: {
                'a-ratelimit:rateLimit': { enable: false },
              },
            },
            body: { email, consumerUrl },
          }),
        (error: { code?: number }) => error.code === expectedCode,
      );
    } finally {
      await app.bean.passport.signout();
    }
  });
}

async function issuePasswordSetLinkValidationRejected(
  fixture: IAccountPasswordSetFixture,
  consumerUrl: string,
  email: string | undefined,
) {
  await app.bean.executor.mockCtx(async () => {
    await signin(fixture);
    try {
      await assert.rejects(
        () =>
          app.bean.executor.performAction('post', passwordSetIssuePath, {
            innerAccess: false,
            body: { email, consumerUrl },
          }),
        (error: { code?: number }) => error.code === 422,
      );
    } finally {
      await app.bean.passport.signout();
    }
  });
}

async function consumePasswordSet(token: string, newPassword: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.bean.executor.performAction('post', passwordSetConsumePath, {
      innerAccess: false,
      onions: {
        interceptor: {
          'a-ratelimit:rateLimit': { enable: false },
        },
      },
      body: {
        token,
        newPassword,
        passwordConfirm: newPassword,
      },
    });
  });
}

async function consumePasswordSetRejected(token: string) {
  await assert.rejects(
    () => consumePasswordSet(token, 'first-local-password'),
    (error: { code?: number }) => error.code === 403,
  );
}

async function signin(fixture: IAccountPasswordSetFixture): Promise<void> {
  await app.bean.passport.signinSystem('mock', fixture.userId as any, fixture.name);
}

async function getDigest(token: string): Promise<string> {
  return createHash(token, 'hex', 'sha256');
}

async function getCurrentDigest(userId: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.scope('home-user').cacheRedis.passwordSetCurrent.get(userId);
  });
}

async function getPasswordSetState(digest: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.scope('home-user').cacheRedis.passwordSet.get(digest);
  });
}

async function assertUserEmail(userId: string, email: string | undefined) {
  await app.bean.executor.mockCtx(async () => {
    const user = await app.scope('home-user').model.user.getById(userId);
    assert.equal(user?.email, email);
  });
}

async function setUserEmail(userId: string, email: string) {
  await app.bean.executor.mockCtx(async () => {
    await app.scope('home-user').model.user.updateById(userId, { email });
  });
}

async function assertNoSimpleAuth(userId: string) {
  await app.bean.executor.mockCtx(async () => {
    assert.equal(await app.scope('auth-simple').service.authSimple.hasByUserId(userId), false);
  });
}

async function assertSimpleAuth(userId: string, password: string) {
  await app.bean.executor.mockCtx(async () => {
    const authSimple = app.scope('auth-simple').service.authSimple;
    assert.equal(await authSimple.hasByUserId(userId), true);
    assert.ok(await authSimple.verifyPassword(userId, password));
  });
}

async function getPasswordSetTtl(digest: string) {
  return await getCacheTtl('passwordSet', digest);
}

async function getCurrentDigestTtl(userId: string) {
  return await getCacheTtl('passwordSetCurrent', userId);
}

async function getCacheTtl(cacheName: 'passwordSet' | 'passwordSetCurrent', key: string) {
  return await app.bean.executor.mockCtx(async () => {
    const cache = app.scope('home-user').cacheRedis[cacheName];
    const redisKey = cache.getRedisKey(key);
    if (!redisKey) throw new Error('password-set cache is unavailable');
    const ttl = await app.bean.redis.get('cache').pttl(redisKey);
    return ttl > 0 && ttl <= 15 * 60 * 1000;
  });
}

async function clearPasswordSetState(userId: string): Promise<void> {
  const digest = await app.scope('home-user').cacheRedis.passwordSetCurrent.get(userId);
  if (digest) await app.scope('home-user').cacheRedis.passwordSet.del(digest);
  await app.scope('home-user').cacheRedis.passwordSetCurrent.del(userId);
}

async function assertNoPasswordSetState(userId: string, digest?: string): Promise<void> {
  await app.bean.executor.mockCtx(async () => {
    const currentDigest = await app.scope('home-user').cacheRedis.passwordSetCurrent.get(userId);
    assert.equal(currentDigest, undefined);
    if (digest)
      assert.equal(await app.scope('home-user').cacheRedis.passwordSet.get(digest), undefined);
  });
}
