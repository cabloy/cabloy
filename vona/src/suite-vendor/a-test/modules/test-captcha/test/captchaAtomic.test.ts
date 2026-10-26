import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { uuidv4 } from 'vona';
import { app } from 'vona-mock';
import { CaptchaProviderImageText } from 'vona-module-captcha-simple';

import { CaptchaBoundContext } from '../src/bean/captchaProvider.bound.ts';

const imageScene = 'captcha-simple:simple';
const boundScene = 'test-captcha:bound';

async function cleanup(ids: string[], contexts: CaptchaBoundContext[] = []) {
  await app.bean.executor.mockCtx(async () => {
    const cache = app.bean.captcha.scope.cacheRedis.captcha;
    const keys = new Set(ids);
    for (const context of contexts) {
      const boundKeys = cache.boundKeys(context.authorization);
      keys.add(boundKeys.pointer);
      keys.add(boundKeys.cooldown);
      for (const budget of boundKeys.budgets) keys.add(budget);
    }
    await cache.mdel([...keys]);
  });
}

async function createImage(ids: string[], token: string) {
  return await app.bean.executor.mockCtx(async () => {
    const captcha = await app.bean.captcha.create(imageScene);
    ids.push(captcha.id);
    await app.bean.captcha.updateCaptchaToken(captcha.id, token);
    return captcha;
  });
}

async function createBound(ids: string[], context: CaptchaBoundContext) {
  return await app.bean.executor.mockCtx(async () => {
    const captcha = await app.bean.captcha.create(boundScene, context);
    if (captcha.id) ids.push(captcha.id);
    assert.equal(captcha.status, 'accepted');
    assert.ok(captcha.id);
    assert.equal(captcha.token, undefined);
    return captcha;
  });
}

async function verifyBound(id: string, token: string, context: CaptchaBoundContext) {
  return await app.bean.executor.mockCtx(async () => {
    return await app.bean.captcha.verify(id, token, boundScene, context);
  });
}

describe('captchaAtomic.test.ts', { concurrency: false }, () => {
  it('image: concurrent correct verification consumes once', { timeout: 10_000 }, async t => {
    const ids: string[] = [];
    const token = uuidv4();
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const provider = app.bean._getBean(CaptchaProviderImageText);
    const originalVerify = provider.verify.bind(provider);
    let arrivals = 0;
    const verify = t.mock.method(provider, 'verify', async (wanted, input, options) => {
      // Providers are app-owned; only pause this test's unique token.
      if (wanted === token) {
        if (++arrivals === 2) entered.resolve();
        await release.promise;
      }
      return await originalVerify(wanted, input, options);
    });
    const attempts: Promise<boolean>[] = [];
    try {
      const captcha = await createImage(ids, token);
      for (let i = 0; i < 2; i++) {
        attempts.push(
          app.bean.executor.mockCtx(async () => {
            return await app.bean.captcha.verify(captcha.id, token, imageScene);
          }),
        );
      }
      await entered.promise;
      release.resolve();
      const results = await Promise.all(attempts);
      assert.equal(results.filter(Boolean).length, 1);
      await app.bean.executor.mockCtx(async () => {
        assert.equal(await app.bean.captcha.getCaptchaData(captcha.id), undefined);
      });
    } finally {
      release.resolve();
      await Promise.allSettled(attempts);
      verify.mock.restore();
      await cleanup(ids);
    }
  });

  it('image: refresh invalidates an in-flight correct verdict', { timeout: 10_000 }, async t => {
    const ids: string[] = [];
    const token = uuidv4();
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const provider = app.bean._getBean(CaptchaProviderImageText);
    const originalVerify = provider.verify.bind(provider);
    const verify = t.mock.method(provider, 'verify', async (wanted, input, options) => {
      if (wanted === token) {
        entered.resolve();
        await release.promise;
      }
      return await originalVerify(wanted, input, options);
    });
    let attempt: Promise<boolean> | undefined;
    try {
      const captcha = await createImage(ids, token);
      attempt = app.bean.executor.mockCtx(async () => {
        return await app.bean.captcha.verify(captcha.id, token, imageScene);
      });
      await entered.promise;
      const refreshed = await app.bean.executor.mockCtx(async () => {
        await app.bean.captcha.refresh(captcha.id, imageScene);
        return await app.bean.captcha.getCaptchaData(captcha.id);
      });
      assert.ok(refreshed?.token);
      assert.notEqual(refreshed.token, token);
      release.resolve();
      assert.equal(await attempt, false);
      await app.bean.executor.mockCtx(async () => {
        assert.deepEqual(await app.bean.captcha.getCaptchaData(captcha.id), refreshed);
        assert.equal(await app.bean.captcha.verify(captcha.id, refreshed.token, imageScene), true);
      });
    } finally {
      release.resolve();
      if (attempt) await Promise.allSettled([attempt]);
      verify.mock.restore();
      await cleanup(ids);
    }
  });

  it('bound: binding and scope mismatches do not consume attempts', async () => {
    const ids: string[] = [];
    const context = new CaptchaBoundContext();
    try {
      const captcha = await createBound(ids, context);
      for (const field of ['recipient', 'purpose', 'subject'] as const) {
        const other = new CaptchaBoundContext({
          ...context.authorization.binding,
          [field]: uuidv4(),
        });
        other.authorization.scope = context.authorization.scope;
        assert.equal(await verifyBound(captcha.id, context.token, other), false);
      }
      const otherScope = new CaptchaBoundContext({ ...context.authorization.binding });
      otherScope.authorization.scope = new CaptchaBoundContext().authorization.scope;
      assert.equal(await verifyBound(captcha.id, context.token, otherScope), false);
      await app.bean.executor.mockCtx(async () => {
        const data = await app.bean.captcha.getCaptchaData(captcha.id);
        assert.equal(data?.bound?.attemptsRemaining, 5);
      });
      assert.equal(await verifyBound(captcha.id, context.token, context), true);
      assert.equal(await verifyBound(captcha.id, context.token, context), false);
    } finally {
      await cleanup(ids, [context]);
    }
  });

  it('bound: five competing wrong attempts exhaust the generation', async () => {
    const ids: string[] = [];
    const context = new CaptchaBoundContext();
    try {
      const captcha = await createBound(ids, context);
      const attempts: Promise<boolean>[] = [];
      for (let i = 0; i < 5; i++) {
        attempts.push(verifyBound(captcha.id, `${context.token}!`, context));
      }
      const results = await Promise.all(attempts);
      assert.deepEqual(results, [false, false, false, false, false]);
      await app.bean.executor.mockCtx(async () => {
        assert.equal(await app.bean.captcha.getCaptchaData(captcha.id), undefined);
      });
      assert.equal(await verifyBound(captcha.id, context.token, context), false);
    } finally {
      await cleanup(ids, [context]);
    }
  });

  it('bound: reissue supersedes the old code and the new code consumes once', async () => {
    const ids: string[] = [];
    const first = new CaptchaBoundContext();
    const second = new CaptchaBoundContext({ ...first.authorization.binding });
    try {
      const oldCaptcha = await createBound(ids, first);
      const newCaptcha = await createBound(ids, second);
      assert.notEqual(newCaptcha.id, oldCaptcha.id);
      assert.equal(await verifyBound(oldCaptcha.id, first.token, first), false);
      const results = await Promise.all([
        verifyBound(newCaptcha.id, second.token, second),
        verifyBound(newCaptcha.id, second.token, second),
      ]);
      assert.equal(results.filter(Boolean).length, 1);
      await app.bean.executor.mockCtx(async () => {
        assert.equal(await app.bean.captcha.getCaptchaData(newCaptcha.id), undefined);
      });
    } finally {
      await cleanup(ids, [first, second]);
    }
  });
});
