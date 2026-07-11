import { catchError } from '@cabloy/utils';
import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

function assertViewInternalFieldsAbsent(view: Record<string, unknown>) {
  assert.equal('provider' in view, false);
  assert.equal('resourceId' in view, false);
  assert.equal('clientName' in view, false);
  assert.equal('fileScene' in view, false);
  assert.equal('meta' in view, false);
}

describe('fileNative.test.ts', () => {
  it('action:file:native upload/get/download/delete', async () => {
    await app.bean.executor.mockCtx(async () => {
      const filePath = path.join(os.tmpdir(), 'test-file-native.txt');
      await fse.writeFile(filePath, 'hello file-native');
      const file = await app.bean.file.upload(
        'file-native:native',
        {
          file: filePath,
          filename: 'hello.txt',
          contentType: 'text/plain',
          public: true,
        },
        {
          clientName: 'default',
        },
      );
      assert.equal(file.provider, 'file-native:native');
      assert.equal(file.filename, 'hello.txt');
      assert.equal(file.public, true);
      assert.equal(typeof file.objectKey, 'string');
      assert.equal(typeof file.etag, 'string');

      const file2 = await app.bean.file.get(file.id);
      assert.equal(file2?.resourceId, file.resourceId);

      const publicUrl = await app.bean.file.getDownloadUrl(file.id);
      assert.equal(publicUrl.includes('/api/static/'), true);

      const view = await app.bean.file.resolveView(file.id);
      assert.equal(view?.id, file.id);
      assert.equal(typeof view?.uploadedAt, 'object');
      assert.equal(view?.downloadUrl.includes('/api/static/'), true);
      assert.equal(view?.signed, false);
      assertViewInternalFieldsAbsent(view ?? {});

      const privateFile = await app.bean.file.upload(
        'file-native:native',
        {
          file: filePath,
          filename: 'private.txt',
          contentType: 'text/plain',
          public: false,
        },
        {
          clientName: 'default',
        },
      );
      const privateUrl = await app.bean.file.getDownloadUrl(privateFile.id);
      assert.equal(privateUrl.includes('/file/download/'), true);
      assert.equal(privateUrl.includes('token='), true);

      const privateView = await app.bean.file.resolveView(privateFile.id);
      assert.equal(privateView?.id, privateFile.id);
      assert.equal(typeof privateView?.uploadedAt, 'object');
      assert.equal(privateView?.downloadUrl.includes('/file/download/'), true);
      assert.equal(privateView?.signed, true);
      assertViewInternalFieldsAbsent(privateView ?? {});

      const publicDownload = await app.bean.file.download(file.id);
      assert.equal(publicDownload.kind, 'buffer');
      assert.equal(publicDownload.buffer?.toString(), 'hello file-native');

      const privateDownload = await app.bean.file.download(privateFile.id, {
        signed: false,
        responseMode: 'buffer',
      });
      assert.equal(privateDownload.kind, 'buffer');
      assert.equal(privateDownload.buffer?.toString(), 'hello file-native');

      await app.bean.file.delete(file.id);
      await app.bean.file.delete(privateFile.id);
      const deletedFile = await app.bean.file.get(file.id);
      const deletedPrivate = await app.bean.file.get(privateFile.id);
      assert.equal(deletedFile, undefined);
      assert.equal(deletedPrivate, undefined);
      await fse.remove(filePath);
    });
  });

  it('action:file:native unsupported upload-url and direct-upload', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [uploadUrlRes, uploadUrlErr] = await catchError(() =>
        app.bean.file.uploadUrl(
          'file-native:native',
          {
            url: 'https://example.com/file.txt',
            filename: 'file.txt',
            contentType: 'text/plain',
            public: true,
          },
          {
            clientName: 'default',
          },
        ),
      );
      assert.equal(uploadUrlRes, undefined);
      assert.equal(
        uploadUrlErr?.message,
        'File provider does not support uploadUrl: file-native:native',
      );

      const [directUploadRes, directUploadErr] = await catchError(() =>
        app.bean.file.createDirectUpload(
          'file-native:native',
          {
            filename: 'file.txt',
            contentType: 'text/plain',
            public: true,
          },
          {
            clientName: 'default',
          },
        ),
      );
      assert.equal(directUploadRes, undefined);
      assert.equal(
        directUploadErr?.message,
        'File provider does not support createDirectUpload: file-native:native',
      );
    });
  });
});
