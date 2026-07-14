import type { IFileUploadPolicyResolved } from 'vona-module-a-file';

import { catchError } from '@cabloy/utils';
import fse from 'fs-extra';
import assert from 'node:assert';
import { Blob } from 'node:buffer';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $apiPath } from 'vona-module-a-openapiutils';

const textFile = Buffer.from('hello upload');
const uploadFilenameChinese = '更新地址.txt';

function assertInternalFieldsAbsent(data: Record<string, unknown>) {
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

describe('fileUpload.test.ts', () => {
  it('action:file:upload api requires auth', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [res, err] = await catchError(async () => {
        const formData = new FormData();
        formData.append('fileScene', 'test-file:publicFile');
        formData.append(
          'file',
          new (Blob as any)([textFile], { type: 'text/plain' }),
          'upload.txt',
        );
        const url = app.util.getAbsoluteUrlByApiPath($apiPath('/file/upload'));
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

  it('action:file:upload api', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock('admin');
      const fileIds: number[] = [];
      try {
        const uploadPolicyUrl = app.util.getAbsoluteUrlByApiPath('/file/upload-policy');
        const uploadPolicyRes = await fetch(uploadPolicyUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileScene: 'test-file:publicFile',
          }),
        });
        assert.equal(uploadPolicyRes.ok, true);
        const uploadPolicyData = await uploadPolicyRes.json();
        assert.equal(uploadPolicyData.data.directUpload, false);
        assert.equal('provider' in uploadPolicyData.data, false);
        assert.equal('clientName' in uploadPolicyData.data, false);

        const uploadFile = async (filename: string) => {
          const formData = new FormData();
          formData.append('fileScene', 'test-file:publicFile');
          formData.append('file', new (Blob as any)([textFile], { type: 'text/plain' }), filename);
          const url = app.util.getAbsoluteUrlByApiPath($apiPath('/file/upload'));
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwt.accessToken}`,
            },
            body: formData,
          });
          assert.equal(res.ok, true);
          return await res.json();
        };

        for (const filename of ['upload.txt', uploadFilenameChinese]) {
          const data = await uploadFile(filename);
          fileIds.push(data.data.id);
          assert.equal(data.data.filename, filename);
          assert.equal(data.data.uploadedAt instanceof Date, true);
          assert.equal(typeof data.data.url, 'string');
          assert.equal(data.data.signed, false);
          assertInternalFieldsAbsent(data.data);
        }
      } finally {
        for (const fileId of fileIds) {
          await app.bean.file.delete(fileId);
        }
        await app.bean.passport.signout();
      }
    });
  });

  it('action:file:direct-upload and upload-url api', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock('admin');
      const provider = await app.bean.fileProvider.get({
        providerName: 'file-cloudflare:cloudflare',
        clientName: 'default',
      });
      const clientOptionsRaw = provider.clientOptions;
      const fileIds: number[] = [];
      const fileCloudflare = app.bean._getBean('file-cloudflare.service.fileCloudflare' as never);
      const uploadRaw = fileCloudflare.upload;
      const uploadUrlRaw = fileCloudflare.uploadUrl;
      try {
        await app.bean.fileProvider.scope.model.fileProvider.updateById(provider.id, {
          clientOptions: {
            endpoint: 'https://account123.r2.cloudflarestorage.com',
            accessKeyId: 'access-key',
            secretAccessKey: 'secret-key',
            bucket: 'bucket-a',
            deliveryBaseUrl: 'https://cdn.example.com/files',
            public: false,
          } as any,
        });
        fileCloudflare.upload = async (input: any) => {
          return {
            resourceId: 'cf-upload-url-api-1',
            bucket: 'bucket-a',
            objectKey: 'folder/upload-url.txt',
            filename: input.filename,
            contentType: input.contentType,
            size: input.size ?? textFile.length,
            etag: 'etag123',
            deliveryBaseUrl: 'https://cdn.example.com/files',
            public: input.public ?? false,
            meta: input.meta,
          };
        };
        fileCloudflare.uploadUrl = async (input: any) => {
          assert.equal(input.url, 'https://example.com/upload-url.txt');
          assert.equal(input.policy.fileScene, 'test-file:cloudflareFile');
          return {
            resourceId: 'cf-upload-url-api-1',
            bucket: 'bucket-a',
            objectKey: 'folder/upload-url.txt',
            filename: 'upload-url.txt',
            contentType: 'text/plain',
            size: textFile.length,
            etag: 'etag123',
            deliveryBaseUrl: 'https://cdn.example.com/files',
            public: false,
            meta: input.meta,
          };
        };
        const uploadPolicyUrl = app.util.getAbsoluteUrlByApiPath('/file/upload-policy');
        const uploadPolicyRes = await fetch(uploadPolicyUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileScene: 'test-file:cloudflareFile',
          }),
        });
        assert.equal(uploadPolicyRes.ok, true);
        const uploadPolicyData = await uploadPolicyRes.json();
        assert.equal(uploadPolicyData.data.directUpload, true);
        assert.equal('provider' in uploadPolicyData.data, false);
        assert.equal('clientName' in uploadPolicyData.data, false);

        const directUrl = app.util.getAbsoluteUrlByApiPath('/file/direct-upload');
        const directRes = await fetch(directUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileScene: 'test-file:cloudflareFile',
            size: textFile.length,
            mimeType: 'text/plain',
            filename: 'direct.txt',
            contentType: 'text/plain',
          }),
        });
        assert.equal(directRes.ok, true);
        const directData = await directRes.json();
        fileIds.push(directData.data.id);
        assert.equal(directData.data.method, 'PUT');
        assert.equal(typeof directData.data.uploadUrl, 'string');
        assert.equal(directData.data.public, false);
        assertInternalFieldsAbsent(directData.data);

        const uploadUrl = app.util.getAbsoluteUrlByApiPath('/file/upload-url');
        const uploadUrlRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileScene: 'test-file:cloudflareFile',
            size: textFile.length,
            mimeType: 'text/plain',
            url: 'https://example.com/upload-url.txt',
            filename: 'upload-url.txt',
            contentType: 'text/plain',
          }),
        });
        assert.equal(uploadUrlRes.ok, true);
        const uploadUrlData = await uploadUrlRes.json();
        fileIds.push(uploadUrlData.data.id);
        assert.equal(uploadUrlData.data.filename, 'upload-url.txt');
        assert.equal(uploadUrlData.data.uploadedAt instanceof Date, true);
        assert.equal(uploadUrlData.data.signed, true);
        assert.equal(uploadUrlData.data.url.includes('X-Amz-Algorithm='), true);
        assertInternalFieldsAbsent(uploadUrlData.data);
      } finally {
        for (const fileId of fileIds) {
          await app.bean.file.scope.model.file.deleteById(fileId);
        }
        fileCloudflare.upload = uploadRaw;
        fileCloudflare.uploadUrl = uploadUrlRaw;
        await app.bean.fileProvider.scope.model.fileProvider.updateById(provider.id, {
          clientOptions: clientOptionsRaw ?? null,
        });
        await app.bean.passport.signout();
      }
    });
  });

  it('action:file:download api private token behavior', async () => {
    await app.bean.executor.mockCtx(async () => {
      const filePath = path.join(os.tmpdir(), 'test-file-download-route.txt');
      let privateFileId: number | undefined;
      let otherPrivateFileId: number | undefined;
      await fse.writeFile(filePath, textFile);
      try {
        const privateFile = await app.bean.file.upload(
          'file-native:native',
          {
            file: filePath,
            filename: 'private-download.txt',
            contentType: 'text/plain',
            public: false,
          },
          {
            clientName: 'default',
            fileScene: 'test-file:privateFile',
          },
        );

        const otherPrivateFile = await app.bean.file.upload(
          'file-native:native',
          {
            file: filePath,
            filename: 'other-private-download.txt',
            contentType: 'text/plain',
            public: false,
          },
          {
            clientName: 'default',
            fileScene: 'test-file:privateFile',
          },
        );

        privateFileId = privateFile.id;
        otherPrivateFileId = otherPrivateFile.id;
        const privateUrl = new URL(app.util.getAbsoluteUrlByApiPath($apiPath('/file/download')));
        privateUrl.searchParams.set('fileId', String(privateFile.id));
        const privateUnauthorizedRes = await fetch(privateUrl);
        assert.equal(privateUnauthorizedRes.status, 401);

        const downloadToken = await app.bean.fileUploadPolicy.createDownloadToken({
          fileId: privateFile.id,
        });
        privateUrl.searchParams.set('token', downloadToken.token);
        const privateAuthorizedRes = await fetch(privateUrl);
        assert.equal(privateAuthorizedRes.ok, true);
        assert.equal(
          privateAuthorizedRes.headers.get('content-type')?.includes('text/plain'),
          true,
        );
        assert.equal(await privateAuthorizedRes.text(), textFile.toString());

        const alteredUrl = new URL(privateUrl);
        alteredUrl.searchParams.set('fileId', String(otherPrivateFile.id));
        const alteredRes = await fetch(alteredUrl);
        assert.equal(alteredRes.status, 401);

        await app.bean.passport.signinMock();
        const audienceToken = await app.bean.fileUploadPolicy.createDownloadToken({
          fileId: privateFile.id,
          audienceUserId: app.bean.passport.currentUser!.id,
        });
        const passportCode = await app.bean.passport.createTempAuthToken({
          path: '/api/file/download',
        });
        const audienceUrl = new URL(privateUrl);
        audienceUrl.searchParams.set('token', audienceToken.token);
        audienceUrl.searchParams.set('x-vona-passport-code', passportCode);
        const audienceAuthorizedRes = await fetch(audienceUrl);
        assert.equal(audienceAuthorizedRes.ok, true);
        await app.bean.passport.signout();

        const audienceUnauthorizedUrl = new URL(privateUrl);
        audienceUnauthorizedUrl.searchParams.set('token', audienceToken.token);
        const audienceUnauthorizedRes = await fetch(audienceUnauthorizedUrl);
        assert.equal(audienceUnauthorizedRes.status, 401);

        const missingUrl = new URL(app.util.getAbsoluteUrlByApiPath($apiPath('/file/download')));
        missingUrl.searchParams.set('fileId', '999999999');
        const missingRes = await fetch(missingUrl);
        assert.equal(missingRes.status, 404);

        await app.bean.file.delete(privateFile.id);
        await app.bean.file.delete(otherPrivateFile.id);
      } finally {
        if (privateFileId) await app.bean.file.delete(privateFileId);
        if (otherPrivateFileId) await app.bean.file.delete(otherPrivateFileId);
        await app.bean.passport.signout();
        await fse.remove(filePath);
      }
    });
  });

  it('action:file:upload policy validate upload file', async () => {
    await app.bean.executor.mockCtx(async () => {
      const filePath = path.join(os.tmpdir(), 'test-file-upload-policy.txt');
      await fse.writeFile(filePath, textFile);
      const payload: IFileUploadPolicyResolved = {
        fileScene: 'test-file:publicFile',
        providerName: 'file-native:native',
        clientName: 'default',
        public: true,
        fileSize: textFile.length,
        mimeType: 'text/plain',
        mimeTypes: ['text/*'],
        extensions: ['.txt'],
      };
      try {
        await app.bean.fileUploadPolicy.validateUploadFile(
          {
            file: filePath,
            filename: 'upload.txt',
            mimeType: 'text/plain',
          },
          payload,
        );

        const [res, err] = await catchError(() =>
          app.bean.fileUploadPolicy.validateUploadFile(
            {
              file: filePath,
              filename: 'upload.bin',
              mimeType: 'text/plain',
            },
            payload,
          ),
        );
        assert.equal(res, undefined);
        assert.equal(err?.code, 403);
        assert.equal(err?.message.includes('unsupported file extension'), true);
      } finally {
        await fse.remove(filePath);
      }
    });
  });
});
