import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { Blob } from 'node:buffer';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $apiPath } from 'vona-module-a-openapiutils';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
  'base64',
);

describe('imageUpload.test.ts', () => {
  it('action:image:upload api requires auth', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [res, err] = await catchError(async () => {
        const formData = new FormData();
        formData.append('image', new (Blob as any)([tinyPng], { type: 'image/png' }), 'image.png');
        const url = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload', 'a-image'));
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const error: any = new Error(`http error: ${response.status}`);
          error.code = response.status;
          throw error;
        }
        return await response.json();
      });
      assert.equal(res, undefined);
      assert.equal(err?.code, 401);
    });
  });

  it('action:image:upload api', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock('admin');
      const formData = new FormData();
      formData.append('image', new (Blob as any)([tinyPng], { type: 'image/png' }), 'image.png');
      const url = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload', 'a-image'));
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      assert.equal(data.data.filename, 'image.png');
      assert.equal(data.data.provider, 'image-native:native');
      assert.deepEqual(data.data.variants.original, {});
      assert.equal(typeof data.data.url, 'string');
      assert.equal(data.data.url.length > 0, true);
      await app.bean.passport.signout();
    });
  });
});
