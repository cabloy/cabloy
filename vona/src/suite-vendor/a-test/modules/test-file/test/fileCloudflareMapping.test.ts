import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('fileCloudflareMapping.test.ts', () => {
  it('action:file:cloudflare download url and direct upload mapping', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fileProvider = await app.bean.fileProvider.get({
        providerName: 'file-cloudflare:cloudflare',
        clientName: 'default',
      });
      await app.bean.fileProvider.scope.model.fileProvider.updateById(fileProvider.id, {
        clientOptions: {
          endpoint: 'https://account123.r2.cloudflarestorage.com',
          accessKeyId: 'access-key',
          secretAccessKey: 'secret-key',
          bucket: 'bucket-a',
          deliveryBaseUrl: 'https://cdn.example.com/files',
          public: true,
        } as any,
      });
      const fileCloudflare = app.bean._getBean('file-cloudflare.service.fileCloudflare' as never);

      const publicUrl = await fileCloudflare.getDownloadUrl(
        {
          bucket: 'bucket-a',
          objectKey: 'folder/file.txt',
          public: true,
          deliveryBaseUrl: 'https://cdn.example.com/files',
        } as any,
        {
          endpoint: 'https://account123.r2.cloudflarestorage.com',
          accessKeyId: 'access-key',
          secretAccessKey: 'secret-key',
          bucket: 'bucket-a',
          deliveryBaseUrl: 'https://cdn.example.com/files',
          public: true,
        },
      );
      assert.equal(publicUrl, 'https://cdn.example.com/files/folder/file.txt');

      const directUpload = await fileCloudflare.createDirectUpload(
        {
          filename: 'hello.txt',
          contentType: 'text/plain',
          public: false,
        },
        {
          endpoint: 'https://account123.r2.cloudflarestorage.com',
          accessKeyId: 'access-key',
          secretAccessKey: 'secret-key',
          bucket: 'bucket-a',
          public: false,
        },
      );
      assert.equal(directUpload.method, 'PUT');
      assert.equal(directUpload.bucket, 'bucket-a');
      assert.equal(typeof directUpload.uploadUrl, 'string');
      assert.equal(directUpload.uploadUrl.includes('X-Amz-Algorithm='), true);

      const beanDirectUpload = await app.bean.file.createDirectUpload(
        'file-cloudflare:cloudflare',
        {
          filename: 'hello.txt',
          contentType: 'text/plain',
          public: false,
        },
        {
          clientName: 'default',
        },
      );
      assert.equal(beanDirectUpload.method, 'PUT');
      assert.equal(typeof beanDirectUpload.uploadUrl, 'string');
      assert.equal('clientName' in beanDirectUpload, false);
      assert.equal('fileScene' in beanDirectUpload, false);
      assert.equal('bucket' in beanDirectUpload, false);
      assert.equal('objectKey' in beanDirectUpload, false);
      assert.equal('etag' in beanDirectUpload, false);
      assert.equal('meta' in beanDirectUpload, false);
      assert.equal('storagePath' in beanDirectUpload, false);
      assert.equal('deliveryBaseUrl' in beanDirectUpload, false);
      assert.equal('raw' in beanDirectUpload, false);

      const view = beanDirectUpload?.id
        ? await app.bean.file.resolveView(beanDirectUpload.id, undefined, {
            signed: true,
            expiresIn: 600,
          })
        : undefined;
      if (view) {
        assert.equal(view.id, beanDirectUpload.id);
        assert.equal(view.provider, 'file-cloudflare:cloudflare');
        assert.equal(view.downloadUrl.includes('X-Amz-Algorithm='), true);
        assert.equal(view.signed, true);
        assert.equal('clientName' in view, false);
        assert.equal('fileScene' in view, false);
        assert.equal('meta' in view, false);
      }
    });
  });
});
