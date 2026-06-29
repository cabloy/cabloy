import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('imageCloudflareMapping.test.ts', () => {
  it('action:image:cloudflare mapping', async () => {
    await app.bean.executor.mockCtx(async () => {
      const file = path.join(os.tmpdir(), 'test-image-cloudflare.txt');
      await fse.writeFile(file, 'hello cloudflare');
      const image = await app.bean.image.upload(
        'image-cloudflare:cloudflare',
        {
          file,
          filename: 'cloudflare.txt',
          contentType: 'text/plain',
        },
        {
          clientName: 'default',
        },
      );
      assert.equal(image.provider, 'image-cloudflare:cloudflare');
      assert.deepEqual(image.variants?.original ?? {}, {});
      const namedUrl = await app.bean.image.getVariantUrl(image.id, 'original');
      assert.equal(namedUrl.includes('/cloudflare:cloudflare.txt/original'), true);
      const customUrl = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 320, height: 180, fit: 'cover' },
      });
      assert.equal(customUrl.includes('width=320'), true);
      assert.equal(customUrl.includes('height=180'), true);
      const download = await app.bean.image.download(image.id);
      assert.equal(download.kind, 'url');
      await app.bean.image.delete(image.id);
      await fse.remove(file);
    });
  });
});
