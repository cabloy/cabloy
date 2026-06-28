import assert from 'node:assert';
import { Blob } from 'node:buffer';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $apiPath } from 'vona-module-a-openapiutils';

describe('imageUpload.test.ts', () => {
  it('action:image:upload api', async () => {
    await app.bean.executor.mockCtx(async () => {
      const formData = new FormData();
      formData.append(
        'image',
        new (Blob as any)(['hello world!'], { type: 'text/plain' }),
        'image.txt',
      );
      const url = app.util.getAbsoluteUrlByApiPath($apiPath('/test/image/upload'));
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      assert.equal(data.data.filename, 'image.txt');
      assert.equal(data.data.provider, 'image-native:native');
    });
  });
});
