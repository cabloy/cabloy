import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { effectScope, reactive, watch } from 'vue';

async function createRuntime(initialPassport?: any) {
  const updates: any[] = [];
  const calls: string[] = [];
  const scope = effectScope();
  let current: () => Promise<any> = async () => undefined;
  let gotoLogin: () => Promise<void> = async () => undefined;
  class BeanModelBase {
    sys = { env: { SITE_ID: 'admin' } };
    scope = { config: { accessToken: { expireTimeDelay: 0 } } };
    $ssr = { cookieDisabledOnServer: false };
    app = {
      meta: { cookie: { getItem: () => undefined }, locale: {} },
      $gotoReturnTo() {
        calls.push('navigate');
      },
      async $gotoLogin() {
        calls.push('login');
        await gotoLogin();
      },
    };

    $api = { homeUserPassport: { current: () => current() } };
    $modelPersistence = {
      update: (identity: any, options: any) => {
        updates.push({ identity, options, token: (this as any).accessToken });
        calls.push('scope');
      },
    };

    $computed() {}
    $useStateLocal(options: any) {
      if (options.queryKey[0] === 'passport') return initialPassport;
    }

    $useStateMem(options: any) {
      return this.$useStateLocal(options);
    }

    $useStateCookie() {
      return 'initial-token';
    }

    $watch(source: any, callback: any, options: any) {
      return scope.run(() => watch(source, callback, options));
    }

    async $clear() {
      calls.push('clear');
    }
  }
  const source = readFileSync(new URL('../../src/model/passport.ts', import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?;\n/gm, '')
    .replace(/^@Model[^\n]*\n/gm, '');
  const javascript = stripTypeScriptTypes(source).replace(
    'export class ModelPassport',
    'class ModelPassport',
  );
  const ModelPassport = new Function('BeanModelBase', `${javascript}\nreturn ModelPassport;`)(
    BeanModelBase,
  );
  const passport = reactive(new ModelPassport());
  await passport.appInitialize();
  return {
    passport,
    updates,
    calls,
    setCurrent(callback: () => Promise<any>) {
      current = callback;
    },
    setGotoLogin(callback: () => Promise<void>) {
      gotoLogin = callback;
    },
    dispose() {
      scope.stop();
    },
  };
}

function identity(id = 1, instanceId: number | null = 2) {
  return { instanceId, user: { id, name: 'User' }, roles: [] };
}

function loginData(id = 1, instanceId: number | null = 2) {
  return {
    passport: identity(id, instanceId),
    jwt: { accessToken: `token-${id}`, expiresIn: 3600, refreshToken: `refresh-${id}` },
  };
}

function deferred() {
  let resolve!: (value: any) => void;
  const promise = new Promise<any>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

test('Passport initialization supplies null identity without introducing a readiness gate', async () => {
  const runtime = await createRuntime();
  try {
    assert.deepEqual(runtime.updates, [
      {
        identity: { instanceId: null, siteId: 'admin', userId: undefined },
        options: { initial: true },
        token: 'initial-token',
      },
    ]);
  } finally {
    runtime.dispose();
  }
});

test('Passport initial identity is adopted and login publishes only after installing its token', async () => {
  const runtime = await createRuntime(identity());
  try {
    assert.equal(runtime.updates[0].options.initial, true);
    assert.deepEqual(runtime.updates[0].identity, { instanceId: 2, siteId: 'admin', userId: 1 });
    runtime.updates.length = 0;
    runtime.calls.length = 0;
    runtime.passport.afterLogin(loginData(3, 4));
    assert.deepEqual(runtime.updates, [
      {
        identity: { instanceId: 4, siteId: 'admin', userId: 3 },
        options: { initial: false },
        token: 'token-3',
      },
    ]);
    assert.deepEqual(runtime.calls, ['scope', 'navigate']);
  } finally {
    runtime.dispose();
  }
});

test('direct Passport and site changes synchronize the same neutral context', async () => {
  const runtime = await createRuntime(identity());
  try {
    runtime.passport.passport = identity(1, 8);
    assert.deepEqual(runtime.updates.at(-1).identity, {
      instanceId: 8,
      siteId: 'admin',
      userId: 1,
    });
    runtime.passport.sys.env.SITE_ID = 'web';
    assert.deepEqual(runtime.updates.at(-1).identity, { instanceId: 8, siteId: 'web', userId: 1 });
    runtime.passport.passport = undefined;
    assert.deepEqual(runtime.updates.at(-1).identity, {
      instanceId: null,
      siteId: 'web',
      userId: undefined,
    });
  } finally {
    runtime.dispose();
  }
});

test('requireRelogin immediately publishes anonymous identity without refetch before navigation and clear', async () => {
  const runtime = await createRuntime(identity());
  const navigation = deferred();
  runtime.setGotoLogin(() => navigation.promise);
  runtime.updates.length = 0;
  runtime.calls.length = 0;
  try {
    const relogin = runtime.passport.requireRelogin();
    assert.equal(runtime.passport.passport, undefined);
    assert.equal(runtime.passport.accessToken, undefined);
    assert.deepEqual(runtime.updates, [
      {
        identity: { instanceId: null, siteId: 'admin', userId: undefined },
        options: { initial: false, refetchActive: false },
        token: undefined,
      },
    ]);
    assert.deepEqual(runtime.calls, ['scope', 'login']);
    await Promise.resolve();
    assert.deepEqual(runtime.calls, ['scope', 'login']);
    navigation.resolve(undefined);
    await relogin;
    assert.deepEqual(runtime.calls, ['scope', 'login', 'clear']);

    runtime.passport.afterLogin(loginData(3, 4));
    assert.equal(runtime.updates.at(-1)!.token, 'token-3');
    assert.notEqual(runtime.updates.at(-1)!.options.refetchActive, false);
    runtime.passport.passport = identity(3, 8);
    assert.notEqual(runtime.updates.at(-1)!.options.refetchActive, false);
    runtime.passport.sys.env.SITE_ID = 'web';
    assert.notEqual(runtime.updates.at(-1)!.options.refetchActive, false);
  } finally {
    navigation.resolve(undefined);
    runtime.dispose();
  }
});

test('refreshCurrent updates identity but a late response cannot undo login or logout', async () => {
  const runtime = await createRuntime(identity());
  try {
    runtime.setCurrent(async () => identity(1, 7));
    await runtime.passport.refreshCurrent();
    assert.equal(runtime.passport.passport.instanceId, 7);
    assert.equal(runtime.updates.at(-1).identity.instanceId, 7);

    const pending = deferred();
    runtime.setCurrent(() => pending.promise);
    const refreshing = runtime.passport.refreshCurrent();
    runtime.passport.afterLogin(loginData(3, 4));
    pending.resolve(identity(1, 7));
    await refreshing;
    assert.equal(runtime.passport.user.id, 3);

    const outgoing = deferred();
    runtime.setCurrent(() => outgoing.promise);
    const outgoingRefresh = runtime.passport.refreshCurrent();
    runtime.calls.length = 0;
    await runtime.passport.requireRelogin();
    assert.deepEqual(runtime.calls, ['scope', 'login', 'clear']);
    assert.equal(runtime.updates.at(-1).identity.instanceId, null);
    assert.equal(runtime.updates.at(-1).token, undefined);
    outgoing.resolve(identity(3, 4));
    await outgoingRefresh;
    assert.equal(runtime.passport.user, undefined);
  } finally {
    runtime.dispose();
  }
});
