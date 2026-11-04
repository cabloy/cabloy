import type { ICaptchaData } from 'vona-module-a-captcha';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const cache = () => app.scope('a-captcha').cacheRedis.captcha;

async function cleanup(id: string, privateRef?: string) {
  await cache().mdel(privateRef ? [id, privateRef] : [id]);
}

describe('captcha.test.ts', () => {
  const sceneName = 'captcha-simple:simple';
  const providerName = 'captcha-simple:imageText';
  it('action:captcha:error', async () => {
    await app.bean.executor.mockCtx(async () => {
      const captcha = await app.bean.captcha.create(sceneName);
      let privateRef: string | undefined;
      try {
        const route = await app.bean.captcha.getCaptchaData(captcha.id);
        privateRef = route?.token;
        assert.equal(captcha.provider, providerName);
        assert.equal(route?.provider, providerName);
        assert.equal(route?.scene, sceneName);
        assert.notEqual(privateRef, captcha.token);
        // The public debug token is the answer; the generic route is only a private reference.
        assert.equal(
          await app.bean.captcha.verify(captcha.id, `${captcha.token}!`, sceneName),
          false,
        );
        assert.equal(await app.bean.captcha.verify(captcha.id, captcha.token, sceneName), false);
        assert.deepEqual(await app.bean.captcha.getCaptchaData(captcha.id), route);
        // A rejected answer leaves an invalidated private generation that can refresh in place.
        const refreshed = await app.bean.captcha.refresh(captcha.id, sceneName);
        assert.equal(refreshed.id, captcha.id);
        assert.equal((await app.bean.captcha.getCaptchaData(captcha.id))?.token, privateRef);
        assert.equal(await app.bean.captcha.verify(captcha.id, refreshed.token, sceneName), true);
      } finally {
        await cleanup(captcha.id, privateRef);
      }
    });
  });
  it('action:captcha:ok', async () => {
    await app.bean.executor.mockCtx(async () => {
      const captcha = await app.bean.captcha.create(sceneName);
      let privateRef: string | undefined;
      try {
        const route = await app.bean.captcha.getCaptchaData(captcha.id);
        privateRef = route?.token;
        assert.equal(captcha.provider, providerName);
        assert.equal(route?.provider, providerName);
        assert.equal(await app.bean.captcha.verify(captcha.id, captcha.token, sceneName), true);
        assert.equal(await app.bean.captcha.verify(captcha.id, captcha.token, sceneName), false);
        assert.deepEqual(await app.bean.captcha.getCaptchaData(captcha.id), route);
        assert.equal(await cache().snapshot(privateRef!), undefined);
      } finally {
        await cleanup(captcha.id, privateRef);
      }
    });
  });
  it('action:captcha api:error', async () => {
    await app.bean.executor.mockCtx(async () => {
      const captcha: ICaptchaData = await app.bean.executor.performAction(
        'post',
        '/captcha/create',
        { body: { scene: sceneName } },
      );
      let privateRef: string | undefined;
      try {
        privateRef = (await app.bean.captcha.getCaptchaData(captcha.id))?.token;
        assert.equal(captcha.provider, providerName);
        const refreshed: ICaptchaData = await app.bean.executor.performAction(
          'post',
          '/captcha/refresh',
          { body: { id: captcha.id, scene: sceneName } },
        );
        assert.equal(refreshed.provider, providerName);
        assert.equal(refreshed.id, captcha.id);
        assert.equal((await app.bean.captcha.getCaptchaData(captcha.id))?.token, privateRef);
        const [_, error] = await catchError(() => {
          return app.bean.executor.performAction('post', '/captcha/verifyImmediate', {
            body: { id: refreshed.id, token: `${refreshed.token}!` },
          });
        });
        assert.equal(error?.code, 403);
        const [_2, error2] = await catchError(() => {
          return app.bean.executor.performAction('post', '/captcha/verifyImmediate', {
            body: { id: refreshed.id, token: refreshed.token },
          });
        });
        assert.equal(error2?.code, 403);
      } finally {
        await cleanup(captcha.id, privateRef);
      }
    });
  });
  it('action:captcha api:ok', async () => {
    await app.bean.executor.mockCtx(async () => {
      const captcha: ICaptchaData = await app.bean.executor.performAction(
        'post',
        '/captcha/create',
        { body: { scene: sceneName } },
      );
      let privateRef: string | undefined;
      try {
        privateRef = (await app.bean.captcha.getCaptchaData(captcha.id))?.token;
        assert.equal(captcha.provider, providerName);
        const refreshed: ICaptchaData = await app.bean.executor.performAction(
          'post',
          '/captcha/refresh',
          { body: { id: captcha.id, scene: sceneName } },
        );
        assert.equal(refreshed.provider, providerName);
        assert.equal(refreshed.id, captcha.id);
        assert.equal((await app.bean.captcha.getCaptchaData(captcha.id))?.token, privateRef);
        const tokenSecondary = await app.bean.executor.performAction(
          'post',
          '/captcha/verifyImmediate',
          { body: { id: refreshed.id, token: refreshed.token } },
        );
        assert.equal(typeof tokenSecondary, 'string');
        await app.bean.executor.performAction('post', '/test/captcha/signin', {
          body: {
            username: 'xxx',
            password: 'xxx',
            captcha: { id: refreshed.id, token: tokenSecondary },
          },
        });
        assert.ok(await app.bean.captcha.getCaptchaData(captcha.id));
        assert.equal(await cache().snapshot(privateRef!), undefined);
      } finally {
        await cleanup(captcha.id, privateRef);
      }
    });
  });
});
