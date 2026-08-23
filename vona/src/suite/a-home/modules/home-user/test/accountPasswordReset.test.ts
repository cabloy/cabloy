import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { createHash } from 'vona';
import { acquireTestLock, app } from 'vona-mock';

const passwordResetRequestPath = '/home/user/account/password-reset/request';
const passwordResetConsumePath = '/home/user/account/password-reset/consume';
const passwordResetConsumerUrl = 'https://account.example.test/home/user/password-reset';
const passwordResetConsumerUrlDev = 'http://localhost:9000/home/user/password-reset';

interface IAccountPasswordResetFixture {
  userId: string;
  authId: string;
  authSimpleId?: string;
  name: string;
  email: string;
}

describe('accountPasswordReset.test.ts', { concurrency: false }, () => {
  const releases: Array<() => void> = [];

  before(async () => {
    for (const scene of ['a-mail', 'a-security', 'home-user']) {
      releases.push(await acquireTestLock(scene));
    }
  });

  after(() => {
    for (const release of releases.reverse()) release();
  });

  it('rejects a request with an invalid CAPTCHA before issuing reset state', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      await assert.rejects(() => requestPasswordResetWithCaptcha(fixture!.email, false));
      await assertNoPasswordResetState(fixture.userId);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  // Test fixtures are locally activated by default because new registration currently creates
  // an inactive user; production eligibility still requires an activated account.
  it('returns the same accepted result for eligible and suppressed recipients', async () => {
    let eligible: IAccountPasswordResetFixture | undefined;
    let disabled: IAccountPasswordResetFixture | undefined;
    let noSimple: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      eligible = await createFixture({ simpleAuth: true });
      disabled = await createFixture({ simpleAuth: true, accountStatus: 'disabled' });
      noSimple = await createFixture({ simpleAuth: false });
      await app.bean.executor.mockCtx(async () => {
        const user = await app.scope('home-user').model.user.getById(eligible!.userId);
        assert.equal(user?.activated, true);
        assert.equal(user?.accountStatus, 'active');
        assert.equal(
          await app.scope('auth-simple').service.authSimple.hasByUserId(eligible!.userId),
          true,
        );
      });
      restoreConfig = await configurePasswordReset();
      mail.send = async () => undefined;

      const results = await Promise.all([
        requestPasswordReset(eligible.email),
        requestPasswordReset(disabled.email),
        requestPasswordReset(noSimple.email),
        requestPasswordReset(`${crypto.randomUUID()}@example.test`),
      ]);
      assert.deepEqual(results, [
        { accepted: true },
        { accepted: true },
        { accepted: true },
        { accepted: true },
      ]);

      assert.ok(await getCurrentDigest(eligible.userId));
      await assertNoPasswordResetState(disabled.userId);
      await assertNoPasswordResetState(noSimple.userId);
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (eligible) await removeFixture(eligible);
      if (disabled) await removeFixture(disabled);
      if (noSimple) await removeFixture(noSimple);
    }
  });

  it('issues digest-backed reset links, supersedes tokens, replaces the credential, and prevents replay', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      const first = await issuePasswordResetLink(fixture);
      assert.match(first.token, /^[0-9a-f-]{36}$/);
      assert.deepEqual(
        { origin: first.origin, path: first.path, hash: first.hash },
        { origin: 'https://account.example.test', path: '/home/user/password-reset', hash: '' },
      );
      assert.equal(first.search, `?token=${first.token}`);
      const firstDigest = getDigest(first.token);
      assert.deepEqual(await getPasswordResetState(firstDigest), {
        purpose: 'password-reset',
        userId: fixture.userId,
        consumerPath: '/home/user/password-reset',
      });
      assert.equal((await getCurrentDigest(fixture.userId)) === firstDigest, true);
      assert.ok(await getCacheTtl('passwordReset', firstDigest));
      assert.ok(await getCacheTtl('passwordResetCurrent', fixture.userId));

      await clearPasswordResetRecipientCooldown(fixture.email);
      const second = await issuePasswordResetLink(fixture);
      const secondDigest = getDigest(second.token);
      assert.equal(await getPasswordResetState(firstDigest), undefined);
      assert.equal((await getCurrentDigest(fixture.userId)) === secondDigest, true);

      await consumePasswordResetRejected(first.token);
      assert.deepEqual(await getPasswordResetState(secondDigest), {
        purpose: 'password-reset',
        userId: fixture.userId,
        consumerPath: '/home/user/password-reset',
      });

      const result = await consumePasswordReset(second.token, 'reset-password');
      assert.deepEqual(result, { requiresRelogin: true });
      await assertNoPasswordResetState(fixture.userId, secondDigest);
      await app.bean.executor.mockCtx(async () => {
        const authSimple = app.scope('auth-simple').service.authSimple;
        assert.equal(
          await authSimple.verifyPassword(fixture!.userId, 'initial-password'),
          undefined,
        );
        assert.ok(await authSimple.verifyPassword(fixture!.userId, 'reset-password'));
      });
      await consumePasswordResetRejected(second.token);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows only one concurrent token consumer', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      const { token } = await issuePasswordResetLink(fixture);

      const results = await Promise.allSettled([
        consumePasswordReset(token, 'reset-password'),
        consumePasswordReset(token, 'reset-password'),
      ]);
      assert.equal(results.filter(item => item.status === 'fulfilled').length, 1);
      assert.equal(results.filter(item => item.status === 'rejected').length, 1);
      await assertNoPasswordResetState(fixture.userId, getDigest(token));
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('rejects a token observed before a concurrent reissue becomes current', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    let staleConsumption: Promise<unknown> | undefined;
    let restoreGet: (() => void) | undefined;
    const observed = Promise.withResolvers<void>();
    const resume = Promise.withResolvers<void>();
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      const first = await issuePasswordResetLink(fixture);
      const firstDigest = getDigest(first.token);
      await clearPasswordResetRecipientCooldown(fixture.email);

      restoreGet = await blockFirstPasswordResetRead(firstDigest, observed.resolve, resume.promise);

      staleConsumption = consumePasswordReset(first.token, 'stale-reset-pass');
      await waitForHolderStage(observed.promise, staleConsumption, 'stale reset consumer');

      const second = await issuePasswordResetLink(fixture);
      const secondDigest = getDigest(second.token);
      assert.equal((await getCurrentDigest(fixture.userId)) === secondDigest, true);
      assert.equal(await getPasswordResetState(firstDigest), undefined);
      assert.deepEqual(await getPasswordResetState(secondDigest), {
        purpose: 'password-reset',
        userId: fixture.userId,
        consumerPath: '/home/user/password-reset',
      });

      resume.resolve();
      await assert.rejects(staleConsumption, (error: { code?: number }) => error.code === 403);
      restoreGet();
      restoreGet = undefined;

      assert.equal((await getCurrentDigest(fixture.userId)) === secondDigest, true);
      assert.ok(await getPasswordResetState(secondDigest));
      assert.deepEqual(await consumePasswordReset(second.token, 'current-reset-pass'), {
        requiresRelogin: true,
      });
      await app.bean.executor.mockCtx(async () => {
        const authSimple = app.scope('auth-simple').service.authSimple;
        assert.equal(
          await authSimple.verifyPassword(fixture!.userId, 'stale-reset-pass'),
          undefined,
        );
        assert.ok(await authSimple.verifyPassword(fixture!.userId, 'current-reset-pass'));
      });
    } finally {
      resume.resolve();
      restoreGet?.();
      await staleConsumption?.catch(() => undefined);
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('returns neutral acceptance without state when normal CORS uses a wildcard', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    let sendCount = 0;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset('*');
      mail.send = async () => {
        sendCount++;
      };

      assert.deepEqual(await requestPasswordReset(fixture.email), { accepted: true });
      assert.equal(sendCount, 0);
      await assertNoPasswordResetState(fixture.userId);
      await assertNoPasswordResetRecipientCooldown(fixture.email);
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows an exact same-origin consumer without a whitelist entry', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset([]);

      const sameOriginConsumerUrl = await app.bean.executor.mockCtx(async () => {
        return `${app.ctx.protocol}://${app.ctx.host}/home/user/password-reset`;
      });
      const issued = await issuePasswordResetLink(fixture, sameOriginConsumerUrl);
      assert.equal(issued.origin, new URL(sameOriginConsumerUrl).origin);
      assert.equal(issued.path, '/home/user/password-reset');
      assert.equal(issued.search, `?token=${issued.token}`);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('allows a local Web origin for a loopback API in test mode', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset([]);

      const issued = await issuePasswordResetLink(fixture, passwordResetConsumerUrlDev);
      assert.deepEqual(
        { origin: issued.origin, path: issued.path, hash: issued.hash },
        { origin: 'http://localhost:9000', path: '/home/user/password-reset', hash: '' },
      );
      assert.equal(issued.search, `?token=${issued.token}`);
      assert.ok(await getCurrentDigest(fixture.userId));
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('preserves a trusted frontend consumer pathname', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();

      const issued = await issuePasswordResetLink(
        fixture,
        'https://account.example.test/portal/account-security/reset-password',
      );
      assert.deepEqual(
        { origin: issued.origin, path: issued.path, hash: issued.hash },
        {
          origin: 'https://account.example.test',
          path: '/portal/account-security/reset-password',
          hash: '',
        },
      );
      assert.equal(issued.search, `?token=${issued.token}`);
      assert.deepEqual(await getPasswordResetState(getDigest(issued.token)), {
        purpose: 'password-reset',
        userId: fixture.userId,
        consumerPath: '/home/user/password-reset',
      });
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('returns neutral acceptance without state for an untrusted consumer URL', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      let sendCount = 0;
      mail.send = async () => {
        sendCount++;
      };

      for (const consumerUrl of [
        'https://account.example.test/home/user/password-reset?next=/other',
        'https://account.example.test/home/user/password-reset?token=attacker',
        'https://account.example.test/home/user/password-reset#token=attacker',
        'https://user@account.example.test/home/user/password-reset',
        'https://account.example.test:444/home/user/password-reset',
        'https://evil.account.example.test/home/user/password-reset',
        '/home/user/password-reset',
        'not a URL',
        'javascript:alert(1)',
        'file:///home/user/password-reset',
        'https://user:password@account.example.test/home/user/password-reset',
        'https:\\account.example.test/home/user/password-reset',
      ]) {
        assert.deepEqual(await requestPasswordReset(fixture.email, consumerUrl), {
          accepted: true,
        });
        await assertNoPasswordResetState(fixture.userId);
        await assertNoPasswordResetRecipientCooldown(fixture.email);
      }
      assert.equal(sendCount, 0);
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('keeps a valid token when a reset payload fails validation', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      const { token } = await issuePasswordResetLink(fixture);
      const digest = getDigest(token);

      await assert.rejects(() => consumePasswordReset(token, 'short'));
      assert.ok(await getPasswordResetState(digest));
      assert.equal((await getCurrentDigest(fixture.userId)) === digest, true);

      assert.deepEqual(await consumePasswordReset(token, 'reset-password'), {
        requiresRelogin: true,
      });
      await assertNoPasswordResetState(fixture.userId, digest);
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('returns neutral acceptance and removes issued state when mail queueing fails', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      mail.send = async () => {
        throw new Error('mail queue unavailable');
      };

      assert.deepEqual(await requestPasswordReset(fixture.email), { accepted: true });
      await assertNoPasswordResetState(fixture.userId);
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('rejects an issued token after the user becomes ineligible', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    try {
      fixture = await createFixture({ simpleAuth: true });
      restoreConfig = await configurePasswordReset();
      const { token } = await issuePasswordResetLink(fixture);

      await app.bean.executor.mockCtx(async () => {
        await app
          .scope('home-user')
          .model.user.updateById(fixture!.userId, { accountStatus: 'disabled' });
      });
      await consumePasswordResetRejected(token);
      assert.equal((await getCurrentDigest(fixture.userId)) === getDigest(token), true);
      await app.bean.executor.mockCtx(async () => {
        const authSimple = app.scope('auth-simple').service.authSimple;
        assert.ok(await authSimple.verifyPassword(fixture!.userId, 'initial-password'));
      });
    } finally {
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });

  it('does not create a local credential for an OAuth-only user', async () => {
    let fixture: IAccountPasswordResetFixture | undefined;
    let restoreConfig: (() => void) | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      fixture = await createFixture({ simpleAuth: false });
      restoreConfig = await configurePasswordReset();
      mail.send = async () => undefined;

      assert.deepEqual(await requestPasswordReset(fixture.email), { accepted: true });
      await assertNoPasswordResetState(fixture.userId);
      await app.bean.executor.mockCtx(async () => {
        assert.equal(
          await app.scope('auth-simple').service.authSimple.hasByUserId(fixture!.userId),
          false,
        );
      });
    } finally {
      mail.send = send;
      restoreConfig?.();
      if (fixture) await removeFixture(fixture);
    }
  });
});

async function createFixture(options: {
  simpleAuth: boolean;
  accountStatus?: 'active' | 'disabled';
}) {
  return await app.bean.executor.mockCtx(async () => {
    const name = `account-password-reset-test-${crypto.randomUUID()}`;
    const email = `${crypto.randomUUID()}@example.test`;
    const user = await app.bean.user.register({ name, email }, true);
    await app.scope('home-user').model.user.updateById(user.id, { activated: true });
    if (options.accountStatus === 'disabled') {
      await app.scope('home-user').model.user.updateById(user.id, { accountStatus: 'disabled' });
    }
    let authSimpleId: string | undefined;
    if (options.simpleAuth) {
      const authSimple = await app
        .scope('auth-simple')
        .service.authSimple.createForUser(user.id, 'initial-password');
      if (!authSimple) throw new Error('failed to create the test local credential');
      authSimpleId = authSimple.id.toString();
    }
    let authId: string;
    if (options.simpleAuth) {
      const auth = await app
        .scope('a-auth')
        .model.auth.select({ where: { userId: user.id } })
        .then(items => items[0]);
      if (!auth) throw new Error('failed to create the test auth relation');
      authId = auth.id.toString();
    } else {
      const provider = await app.bean.authProvider.get({
        providerName: 'test-password-reset-oauth' as any,
        clientName: 'password-reset',
      });
      const auth = await app.scope('a-auth').model.auth.insert({
        userId: user.id,
        authProviderId: provider.id,
        profileId: `profile-${user.id}`,
        profile: JSON.stringify({ id: `profile-${user.id}` }),
      });
      authId = auth.id.toString();
    }
    return {
      userId: user.id.toString(),
      authId,
      authSimpleId,
      name,
      email,
    } satisfies IAccountPasswordResetFixture;
  });
}

async function configurePasswordReset(
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

async function removeFixture(fixture: IAccountPasswordResetFixture): Promise<void> {
  await app.bean.executor.mockCtx(async () => {
    await clearPasswordResetState(fixture.userId);
    await clearPasswordResetRecipientCooldown(fixture.email);
    await app.scope('a-auth').model.auth.deleteById(fixture.authId);
    if (fixture.authSimpleId) {
      await app.scope('auth-simple').model.authSimple.deleteById(fixture.authSimpleId);
    }
    await app.bean.user.removeById(fixture.userId);
  });
}

async function requestPasswordReset(email: string, consumerUrl = passwordResetConsumerUrl) {
  return await requestPasswordResetWithCaptcha(email, true, consumerUrl);
}

async function requestPasswordResetWithCaptcha(
  email: string,
  valid: boolean,
  consumerUrl = passwordResetConsumerUrl,
) {
  return await app.bean.executor.mockCtx(async () => {
    const captcha = await app.bean.captcha.create('captcha-simple:simple');
    const captchaData = await app.bean.captcha.getCaptchaData(captcha.id);
    if (!captchaData?.token) throw new Error('password-reset CAPTCHA token not found');
    return await app.bean.executor.performAction('post', passwordResetRequestPath, {
      innerAccess: false,
      onions: {
        interceptor: {
          'a-ratelimit:rateLimit': { enable: false },
        },
      },
      body: {
        email,
        consumerUrl,
        captcha: { id: captcha.id, token: valid ? captchaData.token : `${captchaData.token}!` },
      },
    });
  });
}

async function issuePasswordResetLink(
  fixture: IAccountPasswordResetFixture,
  consumerUrl = passwordResetConsumerUrl,
) {
  let text: unknown;
  const mail = app.bean.mail;
  const send = mail.send;
  mail.send = async options => {
    text = options.text;
  };
  try {
    await requestPasswordReset(fixture.email, consumerUrl);
  } finally {
    mail.send = send;
  }
  if (typeof text !== 'string') throw new Error('password-reset email text not found');
  const link = text.trim().split('\n').at(-1)?.trim();
  if (!link) throw new Error('password-reset link not found');
  const url = new URL(link);
  const token = url.searchParams.get('token');
  if (!token) throw new Error('password-reset token not found');
  return { origin: url.origin, path: url.pathname, search: url.search, hash: url.hash, token };
}

async function consumePasswordReset(token: string, newPassword: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.bean.executor.performAction('post', passwordResetConsumePath, {
      innerAccess: false,
      body: {
        token,
        newPassword,
        passwordConfirm: newPassword,
      },
    });
  });
}

async function consumePasswordResetRejected(token: string) {
  await assert.rejects(
    () => consumePasswordReset(token, 'reset-password'),
    (error: { code?: number }) => error.code === 403,
  );
}

function getDigest(token: string) {
  return createHash(token, 'hex', 'sha256');
}

function getRecipientDigest(email: string) {
  return createHash(
    `home-user:password-reset-recipient\0${email.trim().toLowerCase()}`,
    'hex',
    'sha256',
  );
}

async function getCurrentDigest(userId: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.scope('home-user').cacheRedis.passwordResetCurrent.get(userId as any);
  });
}

async function getPasswordResetState(digest: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.scope('home-user').cacheRedis.passwordReset.get(digest);
  });
}

async function getCacheTtl(cacheName: 'passwordReset' | 'passwordResetCurrent', key: string) {
  return await app.bean.executor.mockCtx(async () => {
    const cache = app.scope('home-user').cacheRedis[cacheName];
    const redisKey = cache.getRedisKey(key as never);
    if (!redisKey) throw new Error('password-reset cache is unavailable');
    const ttl = await app.bean.redis.get('cache').pttl(redisKey);
    return ttl > 0 && ttl <= 15 * 60 * 1000;
  });
}

async function blockFirstPasswordResetRead(
  digest: string,
  observed: () => void,
  resume: Promise<void>,
): Promise<() => void> {
  return await app.bean.executor.mockCtx(async () => {
    const cache = app.scope('home-user').cacheRedis.passwordReset;
    const get = cache.get;
    let blockFirstRead = true;
    cache.get = async key => {
      const value = await get.call(cache, key);
      if (blockFirstRead && key === digest) {
        blockFirstRead = false;
        observed();
        await resume;
      }
      return value;
    };
    return () => {
      cache.get = get;
    };
  });
}

async function waitForHolderStage(
  entered: Promise<void>,
  holder: Promise<unknown>,
  label: string,
): Promise<void> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.race([
        entered,
        holder.then(
          () => Promise.reject(new Error(`${label} completed before reaching its intended stage`)),
          error => Promise.reject(error),
        ),
      ]),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`${label} did not reach its intended stage`)),
          5_000,
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function clearPasswordResetRecipientCooldown(email: string) {
  await app.bean.executor.mockCtx(async () => {
    await app.scope('home-user').cacheRedis.passwordResetRecipient.del(getRecipientDigest(email));
  });
}

async function assertNoPasswordResetRecipientCooldown(email: string) {
  await app.bean.executor.mockCtx(async () => {
    assert.equal(
      await app.scope('home-user').cacheRedis.passwordResetRecipient.get(getRecipientDigest(email)),
      undefined,
    );
  });
}

async function clearPasswordResetState(userId: string): Promise<void> {
  const digest = await app.scope('home-user').cacheRedis.passwordResetCurrent.get(userId as any);
  if (digest) await app.scope('home-user').cacheRedis.passwordReset.del(digest);
  await app.scope('home-user').cacheRedis.passwordResetCurrent.del(userId as any);
}

async function assertNoPasswordResetState(userId: string, digest?: string): Promise<void> {
  await app.bean.executor.mockCtx(async () => {
    const currentDigest = await app
      .scope('home-user')
      .cacheRedis.passwordResetCurrent.get(userId as any);
    assert.equal(currentDigest, undefined);
    if (digest) {
      assert.equal(await app.scope('home-user').cacheRedis.passwordReset.get(digest), undefined);
    }
  });
}
