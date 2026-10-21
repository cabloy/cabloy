import type { TableIdentity } from 'table-identity';
import type { EntityFileProvider } from 'vona-module-a-file';
import type { IFileProviderCloudflareClientOptions } from 'vona-module-file-cloudflare';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { ServiceFileCloudflare } from 'vona-module-file-cloudflare';

function assertPublicFieldsOnly(data: object) {
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
      const fileCloudflare = app.bean._getBean(ServiceFileCloudflare);
      const finalizeDirectUploadRaw = fileCloudflare.finalizeDirectUpload;
      const fileProvider = await app.bean.fileProvider.get({
        providerName: 'file-cloudflare:cloudflare',
        clientName: 'default',
      });
      const clientOptionsRaw = fileProvider.clientOptions;
      let fileId: TableIdentity | undefined;
      const headObjectCalls: Array<{ bucket?: string; objectKey?: string }> = [];
      try {
        fileCloudflare.finalizeDirectUpload = async file => {
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
        const clientOptions: IFileProviderCloudflareClientOptions = {
          endpoint: 'https://account123.r2.cloudflarestorage.com',
          accessKeyId: 'access-key',
          secretAccessKey: 'secret-key',
          bucket: 'bucket-a',
          deliveryBaseUrl: 'https://cdn.example.com/files',
          public: true,
        };
        await app.bean.fileProvider.scope.model.fileProvider.updateById(fileProvider.id, {
          clientOptions,
        });
        const fileCloudflareService = app.bean._getBean(ServiceFileCloudflare);

        const publicUrl = await fileCloudflareService.getDownloadUrl(
          {
            bucket: 'bucket-a',
            objectKey: 'folder/file.txt',
            public: true,
            deliveryBaseUrl: 'https://cdn.example.com/files',
          },
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
        fileId = beanDirectUpload.id;
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

        const finalizedDirectUpload = await app.bean.file.finalizeDirectUpload(beanDirectUpload.id);
        assert.equal(headObjectCalls.length, 1);
        assert.equal(headObjectCalls[0].bucket, 'bucket-a');
        assert.equal(typeof headObjectCalls[0].objectKey, 'string');
        assert.ok(headObjectCalls[0].objectKey);
        assert.equal(headObjectCalls[0].objectKey.length > 0, true);
        assert.equal(finalizedDirectUpload.size, 12);
        assert.equal(finalizedDirectUpload.contentType, 'text/plain');
        assert.equal(finalizedDirectUpload.etag, 'etag-finalized');
        assert.equal(finalizedDirectUpload.status, 'ready');
        assert.equal(finalizedDirectUpload.finalizedAt instanceof Date, true);

        const view = await app.bean.file.resolveView(beanDirectUpload.id);
        assert.ok(view);
        assert.equal(view.id, beanDirectUpload.id);
        assert.equal(typeof view.uploadedAt, 'object');
        assert.equal(view.downloadUrl.includes('X-Amz-Algorithm='), true);
        assert.equal(view.signed, true);
        assertPublicFieldsOnly(view);
      } finally {
        if (fileId) await app.bean.file.scope.model.file.deleteById(fileId);
        fileCloudflare.finalizeDirectUpload = finalizeDirectUploadRaw;
        await app.bean.fileProvider.scope.model.fileProvider.updateById(fileProvider.id, {
          // Restore SQL NULL as well as configured JSON at the persistence boundary.
          clientOptions: (clientOptionsRaw ?? null) as EntityFileProvider['clientOptions'],
        });
      }
    });
  });
});
