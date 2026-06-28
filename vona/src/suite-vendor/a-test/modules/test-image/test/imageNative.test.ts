import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('imageNative.test.ts', () => {
  it('action:image:native upload/get/delete', async () => {
    await app.bean.executor.mockCtx(async () => {
      const file = path.join(os.tmpdir(), 'test-image-native.txt');
      await fse.writeFile(file, 'hello image');
      const image = await app.bean.image.upload(
        'image-native:native',
        {
          file,
          filename: 'hello.txt',
          contentType: 'text/plain',
        },
        {
          clientName: 'default',
        },
      );
      assert.equal(image.provider, 'image-native:native');
      assert.equal(image.filename, 'hello.txt');
      const image2 = await app.bean.image.get(image.id);
      assert.equal(image2?.resourceId, image.resourceId);
      const url = await app.bean.image.getVariantUrl(image.id, 'original');
      assert.equal(url.includes('/api/static/'), true);
      await app.bean.image.delete(image.id);
      const image3 = await app.bean.image.get(image.id);
      assert.equal(image3, undefined);
      await fse.remove(file);
    });
  });
});
