import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

function assertPublicFieldsOnly(data: Record<string, unknown>) {
  assert.equal('provider' in data, false);
  assert.equal('resourceId' in data, false);
  assert.equal('clientName' in data, false);
  assert.equal('fileScene' in data, false);
  assert.equal('bucket' in data, false);
  assert.equal('objectKey' in data, false);
  assert.equal('etag' in data, false);
  assert.equal('meta' in data, false);
  assert.equal('storagePath' in data, false);
  assert.equal('deliveryBaseUrl' in data, false);
  assert.equal('raw' in data, false);
  assert.equal('draft' in data, false);
  assert.equal('status' in data, false);
  assert.equal('draftExpiresAt' in data, false);
  assert.equal('finalizedAt' in data, false);
}

describe('fileCloudflareMapping.test.ts', () => {
  it('action:file:cloudflare download url and direct upload mapping', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fileCloudflare = app.bean._getBean('file-cloudflare.service.fileCloudflare' as never);
      const finalizeDirectUploadRaw = fileCloudflare.finalizeDirectUpload.bind(fileCloudflare);
      const headObjectCalls: Array<{ bucket?: string; objectKey?: string }> = [];
      fileCloudflare.finalizeDirectUpload = async (file: any) => {
        headObjectCalls.push({ bucket: file.bucket, objectKey: file.objectKey });
        return {
          resourceId: file.resourceId,
          bucket: file.bucket,
          objectKey: file.objectKey,
          filename: file.filename,
          contentType: 'text/plain',
          size: 12,
          etag: 'etag-finalized',
          public: file.public,
          meta: file.meta,
          deliveryBaseUrl: file.deliveryBaseUrl,
        };
      };
      try {
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
        const fileCloudflareService = app.bean._getBean(
          'file-cloudflare.service.fileCloudflare' as never,
        );

        const publicUrl = await fileCloudflareService.getDownloadUrl(
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

        const directUpload = await fileCloudflareService.createDirectUpload(
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
        assertPublicFieldsOnly(beanDirectUpload);

        const [draftUrl, draftUrlErr] = await catchError(() =>
          app.bean.file.getDownloadUrl(beanDirectUpload.id),
        );
        assert.equal(draftUrl, undefined);
        assert.equal(draftUrlErr?.code, 403);

        const [draftView, draftViewErr] = await catchError(() =>
          app.bean.file.resolveView(beanDirectUpload.id),
        );
        assert.equal(draftView, undefined);
        assert.equal(draftViewErr?.code, 403);

        const [draftDownload, draftDownloadErr] = await catchError(() =>
          app.bean.file.download(beanDirectUpload.id),
        );
        assert.equal(draftDownload, undefined);
        assert.equal(draftDownloadErr?.code, 403);

        const finalizedDirectUpload = await (app.bean.file as any).finalizeDirectUpload(
          beanDirectUpload.id,
        );
        assert.equal(headObjectCalls.length, 1);
        assert.equal(headObjectCalls[0].bucket, 'bucket-a');
        assert.equal(typeof headObjectCalls[0].objectKey, 'string');
        assert.equal(headObjectCalls[0].objectKey?.length > 0, true);
        assert.equal(finalizedDirectUpload.size, 12);
        assert.equal(finalizedDirectUpload.contentType, 'text/plain');
        assert.equal(finalizedDirectUpload.etag, 'etag-finalized');
        assert.equal(finalizedDirectUpload.status, 'ready');
        assert.equal(finalizedDirectUpload.finalizedAt instanceof Date, true);

        const view = await app.bean.file.resolveView(beanDirectUpload.id, undefined, {
          signed: true,
          expiresIn: 600,
        });
        assert.ok(view);
        assert.equal(view.id, beanDirectUpload.id);
        assert.equal(typeof view.uploadedAt, 'object');
        assert.equal(view.downloadUrl.includes('X-Amz-Algorithm='), true);
        assert.equal(view.signed, true);
        assertPublicFieldsOnly(view);
      } finally {
        fileCloudflare.finalizeDirectUpload = finalizeDirectUploadRaw;
      }
    });
  });
});
