import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { uuidv4 } from 'vona';
import { app } from 'vona-mock';

const imageScene = 'captcha-simple:simple';
const cache = () => app.scope('a-captcha').cacheRedis.captcha;
const run = <T>(fn: () => Promise<T>) => app.bean.executor.mockCtx(fn);

async function cleanup(keys: string[]) {
  await run(async () => {
    if (keys.length) await cache().mdel(keys);
  });
}

async function createImage(keys: string[], token: string) {
  return await run(async () => {
    const captcha = await app.bean.captcha.create(imageScene);
    keys.push(captcha.id);
    const route = await app.bean.captcha.getCaptchaData(captcha.id);
    assert.ok(route);
    keys.push(route.token);
    await app.bean.captcha.updateCaptchaToken(captcha.id, token);
    return { ...captcha, privateRef: route.token };
  });
}

describe('captchaAtomic.test.ts', { concurrency: false }, () => {
  it('image: concurrent correct verification consumes once', { timeout: 10_000 }, async t => {
    const keys: string[] = [];
    const token = uuidv4();
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const attempts: Promise<boolean>[] = [];
    let restore: (() => void) | undefined;
    try {
      const captcha = await createImage(keys, token);
      restore = await run(async () => {
        const owner = cache();
        const original = owner.snapshot.bind(owner);
        let arrivals = 0;
        const stub = t.mock.method(owner, 'snapshot', async <T>(id: string) => {
          const snapshot = await original<T>(id);
          // Both consumers hold the same private generation before either can CAS.
          if (id === captcha.privateRef && arrivals < 2) {
            if (++arrivals === 2) entered.resolve();
            await release.promise;
          }
          return snapshot;
        });
        return () => stub.mock.restore();
      });
      for (let i = 0; i < 2; i++) {
        attempts.push(run(async () => app.bean.captcha.verify(captcha.id, token, imageScene)));
      }
      await Promise.race([
        entered.promise,
        Promise.all(attempts).then(() => assert.fail('private snapshot gate was not entered')),
      ]);
      release.resolve();
      const results = await Promise.all(attempts);
      assert.equal(results.filter(Boolean).length, 1);
      await run(async () => {
        assert.equal(
          (await app.bean.captcha.getCaptchaData(captcha.id))?.token,
          captcha.privateRef,
        );
        assert.equal(await cache().snapshot(captcha.privateRef), undefined);
        assert.equal(await app.bean.captcha.verify(captcha.id, token, imageScene), false);
      });
    } finally {
      release.resolve();
      await Promise.allSettled(attempts);
      restore?.();
      await cleanup(keys);
    }
  });

  it('image: refresh invalidates an in-flight correct verdict', { timeout: 10_000 }, async t => {
    const keys: string[] = [];
    const token = uuidv4();
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    let attempt: Promise<boolean> | undefined;
    let restore: (() => void) | undefined;
    try {
      const captcha = await createImage(keys, token);
      restore = await run(async () => {
        const owner = cache();
        const original = owner.snapshot.bind(owner);
        let captured = false;
        const stub = t.mock.method(owner, 'snapshot', async <T>(id: string) => {
          const snapshot = await original<T>(id);
          if (id === captcha.privateRef && !captured) {
            captured = true;
            entered.resolve();
            await release.promise;
          }
          return snapshot;
        });
        return () => stub.mock.restore();
      });
      attempt = run(async () => app.bean.captcha.verify(captcha.id, token, imageScene));
      await Promise.race([
        entered.promise,
        attempt.then(() => assert.fail('private snapshot gate was not entered')),
      ]);
      const refreshed = await run(async () => app.bean.captcha.refresh(captcha.id, imageScene));
      assert.equal(refreshed.id, captcha.id);
      assert.equal(typeof refreshed.token, 'string');
      release.resolve();
      assert.equal(await attempt, false);
      await run(async () => {
        assert.equal(
          (await app.bean.captcha.getCaptchaData(captcha.id))?.token,
          captcha.privateRef,
        );
        assert.ok(await cache().snapshot(captcha.privateRef));
        assert.equal(await app.bean.captcha.verify(captcha.id, refreshed.token, imageScene), true);
        assert.equal(await cache().snapshot(captcha.privateRef), undefined);
      });
    } finally {
      release.resolve();
      if (attempt) await Promise.allSettled([attempt]);
      restore?.();
      await cleanup(keys);
    }
  });
});
