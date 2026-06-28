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
      assert.equal(image.variants?.length! > 0, true);
      const download = await app.bean.image.download(image.id);
      assert.equal(download.kind, 'url');
      await app.bean.image.delete(image.id);
      await fse.remove(file);
    });
  });
});
