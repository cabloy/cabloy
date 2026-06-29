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

describe('imageNative.test.ts', () => {
  it('action:image:native upload/get/delete', async () => {
    await app.bean.executor.mockCtx(async () => {
      const file = path.join(os.tmpdir(), 'test-image-native.png');
      await fse.writeFile(file, tinyPng);
      const image = await app.bean.image.upload(
        'image-native:native',
        {
          file,
          filename: 'hello.png',
          contentType: 'image/png',
        },
        {
          clientName: 'default',
          clientOptions: {
            variants: {
              original: {},
              thumbnail: { width: 64, height: 64, fit: 'cover' },
            },
          },
        },
      );
      assert.equal(image.provider, 'image-native:native');
      assert.equal(image.filename, 'hello.png');
      assert.deepEqual(image.variants?.thumbnail, { width: 64, height: 64, fit: 'cover' });
      const image2 = await app.bean.image.get(image.id);
      assert.equal(image2?.resourceId, image.resourceId);
      const originalUrl = await app.bean.image.getVariantUrl(image.id, 'original');
      assert.equal(originalUrl.includes('/api/static/'), true);
      const namedUrl = await app.bean.image.getVariantUrl(image.id, 'thumbnail');
      assert.equal(namedUrl.includes('__thumbnail'), true);
      const customUrl = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 32, height: 32, fit: 'cover' },
      });
      assert.equal(customUrl.includes('__t_'), true);
      const customUrl2 = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 32, height: 32, fit: 'cover' },
      });
      assert.equal(customUrl, customUrl2);
      const download = await app.bean.image.download(image.id, 'original');
      assert.equal(download.kind, 'buffer');
      await app.bean.image.delete(image.id);
      const image3 = await app.bean.image.get(image.id);
      assert.equal(image3, undefined);
      await fse.remove(file);
    });
  });
});
