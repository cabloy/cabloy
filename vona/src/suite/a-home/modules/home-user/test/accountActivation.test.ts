import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { createHash } from 'vona';
import { acquireTestLock, app } from 'vona-mock';

const activationConsumePath = '/home/user/account/activation/consume';
const activationConsumerUrl = 'https://account.example.test/home/user/activation';

describe('accountActivation.test.ts', { concurrency: false, sequential: true }, () => {
  const releases: Array<() => void> = [];
  let restoreConfig: (() => void) | undefined;

  before(async () => {
    for (const scene of ['a-mail', 'a-security', 'home-user']) {
      releases.push(await acquireTestLock(scene));
    }
    restoreConfig = await configureActivation();
  });

  after(() => {
    restoreConfig?.();
    for (const release of releases.reverse()) release();
  });

  it('issues a digest-backed activation link and consumes it once', async () => {
    let fixture: IFixture | undefined;
    try {
      fixture = await createFixture();
      const issued = await issueActivationLink(fixture);
      assert.match(issued.token, /^[0-9a-f-]{36}$/);
      assert.equal(issued.path, '/home/user/activation');
      const digest = getDigest(issued.token);
      assert.deepEqual(await getActivationState(digest), {
        purpose: 'account-activation',
        userId: fixture.userId,
        consumerPath: '/home/user/activation',
        email: fixture.email,
      });
      assert.equal(await getCurrentDigest(fixture.userId), digest);

      await consumeActivation(issued.token);
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(fixture!.userId);
        assert.equal(user?.activated, true);
        const role = await app.scope('home-user').model.role.getByName('registeredUser');
        assert.ok(
          await app.scope('home-user').model.roleUser.get({
            roleId: role!.id,
            userId: fixture!.userId,
          }),
        );
      });
      assert.equal(await getActivationState(digest), undefined);
      assert.equal(await getCurrentDigest(fixture.userId), undefined);
      await assertActivationRejected(issued.token);
    } finally {
      if (fixture) await removeFixture(fixture);
    }
  });

  it('supersedes an earlier activation token', async () => {
    let fixture: IFixture | undefined;
    try {
      fixture = await createFixture();
      const first = await issueActivationLink(fixture);
      const second = await issueActivationLink(fixture);
      assert.equal(await getActivationState(getDigest(first.token)), undefined);
      assert.equal(await getCurrentDigest(fixture.userId), getDigest(second.token));
      await assertActivationRejected(first.token);
      await consumeActivation(second.token);
    } finally {
      if (fixture) await removeFixture(fixture);
    }
  });

  it('issues an activation link through registration and activates the registered user', async () => {
    let registration: IRegistration | undefined;
    try {
      registration = await registerWithActivationLink();
      assert.equal(registration.passport.user.activated, false);
      assert.equal(registration.path, '/home/user/activation');
      const digest = getDigest(registration.token);
      assert.deepEqual(await getActivationState(digest), {
        purpose: 'account-activation',
        userId: registration.userId,
        consumerPath: '/home/user/activation',
        email: registration.email,
      });

      await consumeActivation(registration.token);
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(registration!.userId);
        assert.equal(user?.activated, true);
      });
    } finally {
      if (registration) await removeRegistration(registration);
    }
  });

  it('cleans activation state when mail enqueue fails', async () => {
    let fixture: IFixture | undefined;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      fixture = await createFixture();
      mail.send = async () => {
        throw new Error('mail unavailable');
      };
      await assert.rejects(() =>
        app.bean.executor.mockCtx(async () => {
          await app
            .scope('home-user')
            .service.account.issueActivationLink(fixture!.userId, activationConsumerUrl);
        }),
      );
      assert.equal(await getCurrentDigest(fixture.userId), undefined);
    } finally {
      mail.send = send;
      if (fixture) await removeFixture(fixture);
    }
  });

  it('rejects unsafe activation consumer URLs before creating state', async () => {
    let fixture: IFixture | undefined;
    let sendCount = 0;
    const mail = app.bean.mail;
    const send = mail.send;
    try {
      fixture = await createFixture();
      mail.send = async () => {
        sendCount++;
      };
      for (const consumerUrl of [
        'https://account.example.test/home/user/activation?next=/other',
        'https://account.example.test/home/user/activation?token=attacker',
        'https://account.example.test/home/user/activation#token=attacker',
        'https://user@account.example.test/home/user/activation',
        'https://account.example.test:444/home/user/activation',
        'https://evil.account.example.test/home/user/activation',
        'https://account.example.test/home/user/password-set',
        '/home/user/activation',
        'not a URL',
        'javascript:alert(1)',
        'file:///home/user/activation',
        'https://user:password@account.example.test/home/user/activation',
        'https:\\\\account.example.test/home/user/activation',
      ]) {
        await assert.rejects(
          () =>
            app.bean.executor.mockCtx(async () => {
              await app
                .scope('home-user')
                .service.account.issueActivationLink(fixture!.userId, consumerUrl);
            }),
          (error: { code?: number }) => error.code === 503,
        );
        assert.equal(await getCurrentDigest(fixture.userId), undefined);
      }
      assert.equal(sendCount, 0);
    } finally {
      mail.send = send;
      if (fixture) await removeFixture(fixture);
    }
  });
});

interface IFixture {
  userId: string;
  email: string;
}

interface IRegistration extends IFixture {
  passport: { user: { activated: boolean } };
  token: string;
  path: string;
}

async function configureActivation() {
  return await app.bean.executor.mockCtx(async () => {
    const options =
      app.bean.onion.middlewareSystem.getOnionSlice('a-security:cors').beanOptions.options;
    const whiteListPrevious = options.whiteList;
    options.whiteList = ['https://account.example.test'];
    return () => {
      options.whiteList = whiteListPrevious;
    };
  });
}

async function registerWithActivationLink(): Promise<IRegistration> {
  let text: unknown;
  const mail = app.bean.mail;
  const send = mail.send;
  const username = `account-activation-register-${crypto.randomUUID()}`;
  const email = `${crypto.randomUUID()}@example.test`;
  mail.send = async options => {
    text = options.text;
  };
  try {
    const passport = await app.bean.executor.mockCtx(async () => {
      const captcha = await app.bean.captcha.create('captcha-simple:simple');
      const captchaData = await app.bean.captcha.getCaptchaData(captcha.id);
      if (!captchaData?.token) throw new Error('registration CAPTCHA token not found');
      return await app.bean.executor.performAction('post', '/home/user/passport/register', {
        innerAccess: false,
        onions: {
          interceptor: {
            'a-ratelimit:rateLimit': { enable: false },
          },
        },
        body: {
          username,
          email,
          password: 'initial-password',
          passwordConfirm: 'initial-password',
          consumerUrl: activationConsumerUrl,
          captcha: { id: captcha.id, token: captchaData.token },
        },
      });
    });
    if (typeof text !== 'string') throw new Error('activation email text not found');
    const url = new URL(text.match(/https?:\/\/\S+/)?.[0] ?? '');
    const token = url.searchParams.get('token');
    if (!token) throw new Error('activation token not found');
    return {
      userId: passport.passport.user.id,
      email,
      passport: passport.passport,
      token,
      path: url.pathname,
    };
  } finally {
    mail.send = send;
  }
}

async function removeRegistration(registration: IRegistration) {
  await app.bean.executor.mockCtx(async () => {
    const provider = await app.bean.authProvider.get({
      providerName: 'auth-simple:simple',
      clientName: 'default',
    });
    const auth = await app.scope('a-auth').model.auth.get({
      userId: registration.userId,
      authProviderId: provider.id,
    });
    if (auth) {
      await app.scope('a-auth').model.auth.deleteById(auth.id);
      await app.scope('auth-simple').model.authSimple.deleteById(auth.profileId);
    }
    const role = await app.scope('home-user').model.role.getByName('registeredUser');
    await app.scope('home-user').model.roleUser.delete({
      roleId: role!.id,
      userId: registration.userId,
    });
    const digest = await app
      .scope('home-user')
      .cacheRedis.activationCurrent.get(registration.userId as any);
    if (digest) await app.scope('home-user').cacheRedis.activation.del(digest);
    await app.scope('home-user').cacheRedis.activationCurrent.del(registration.userId as any);
    await app.bean.user.removeById(registration.userId);
  });
}

async function createFixture(): Promise<IFixture> {
  return await app.bean.executor.mockCtx(async () => {
    const email = `${crypto.randomUUID()}@example.test`;
    const user = await app.bean.user.register({
      name: `account-activation-test-${crypto.randomUUID()}`,
      email,
    });
    return { userId: user.id.toString(), email };
  });
}

async function removeFixture(fixture: IFixture) {
  await app.bean.executor.mockCtx(async () => {
    const role = await app.scope('home-user').model.role.getByName('registeredUser');
    await app
      .scope('home-user')
      .model.roleUser.delete({ roleId: role!.id, userId: fixture.userId });
    const digest = await app
      .scope('home-user')
      .cacheRedis.activationCurrent.get(fixture.userId as any);
    if (digest) await app.scope('home-user').cacheRedis.activation.del(digest);
    await app.scope('home-user').cacheRedis.activationCurrent.del(fixture.userId as any);
    await app.bean.user.removeById(fixture.userId);
  });
}

async function issueActivationLink(fixture: IFixture) {
  let text: unknown;
  const mail = app.bean.mail;
  const send = mail.send;
  mail.send = async options => {
    text = options.text;
  };
  try {
    await app.bean.executor.mockCtx(async () => {
      await app
        .scope('home-user')
        .service.account.issueActivationLink(fixture.userId, activationConsumerUrl);
    });
  } finally {
    mail.send = send;
  }
  if (typeof text !== 'string') throw new Error('activation email text not found');
  const url = new URL(text.match(/https?:\/\/\S+/)?.[0] ?? '');
  const token = url.searchParams.get('token');
  if (!token) throw new Error('activation token not found');
  return { token, path: url.pathname };
}

async function consumeActivation(token: string) {
  await app.bean.executor.mockCtx(async () => {
    await app.bean.executor.performAction('post', activationConsumePath, {
      innerAccess: false,
      body: { token },
    });
  });
}

async function assertActivationRejected(token: string) {
  await assert.rejects(
    () => consumeActivation(token),
    (error: { code?: number }) => error.code === 403,
  );
}

function getDigest(token: string) {
  return createHash(token, 'hex', 'sha256');
}

async function getActivationState(digest: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.scope('home-user').cacheRedis.activation.get(digest);
  });
}

async function getCurrentDigest(userId: string) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.scope('home-user').cacheRedis.activationCurrent.get(userId as any);
  });
}
