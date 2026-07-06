import type { IFileUploadContextResolved, IFileUploadTokenPayload } from 'vona-module-a-file';

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

describe('fileUpload.test.ts', () => {
  it('action:file:upload api requires auth', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [res, err] = await catchError(async () => {
        const formData = new FormData();
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
      const resolveUploadContextRaw = app.bean.fileUploadPolicy.resolveUploadContext.bind(
        app.bean.fileUploadPolicy,
      );
      app.bean.fileUploadPolicy.resolveUploadContext = async data => {
        const context = await resolveUploadContextRaw(data);
        return {
          ...context,
          providerName: 'file-native:native',
          clientName: 'default',
          public: true,
        } as IFileUploadContextResolved;
      };
      try {
        const tokenUrl = app.util.getAbsoluteUrlByApiPath($apiPath('/file/upload-token'));
        const tokenRes = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileScene: 'test-file:publicFile',
            size: textFile.length,
            mimeType: 'text/plain',
          }),
        });
        const tokenData = await tokenRes.json();
        const formData = new FormData();
        formData.append('token', tokenData.data.token);
        formData.append(
          'file',
          new (Blob as any)([textFile], { type: 'text/plain' }),
          'upload.txt',
        );
        const url = app.util.getAbsoluteUrlByApiPath($apiPath('/file/upload'));
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt.accessToken}`,
          },
          body: formData,
        });
        assert.equal(res.ok, true);
        const data = await res.json();
        assert.equal(data.data.filename, 'upload.txt');
        assert.equal(data.data.provider, 'file-native:native');
        assert.equal(typeof data.data.url, 'string');
        assert.equal(data.data.signed, false);
      } finally {
        app.bean.fileUploadPolicy.resolveUploadContext = resolveUploadContextRaw;
        await app.bean.passport.signout();
      }
    });
  });

  it('action:file:upload policy validate upload file', async () => {
    await app.bean.executor.mockCtx(async () => {
      const filePath = path.join(os.tmpdir(), 'test-file-upload-policy.txt');
      await fse.writeFile(filePath, textFile);
      const payload: IFileUploadTokenPayload = {
        kind: 'fileUpload',
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
