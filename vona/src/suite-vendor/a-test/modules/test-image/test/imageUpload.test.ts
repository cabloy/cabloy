import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { Blob } from 'node:buffer';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $apiPath } from 'vona-module-a-openapiutils';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
  'base64',
);
const uploadImageFilenameChinese = '测试图片.png';

function createCloudflareResponse(result: Record<string, any>) {
  return new Response(
    JSON.stringify({
      success: true,
      errors: [],
      messages: [],
      result,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

describe('imageUpload.test.ts', () => {
  it('action:image:upload api requires auth', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [res, err] = await catchError(async () => {
        const formData = new FormData();
        formData.append('image', new (Blob as any)([tinyPng], { type: 'image/png' }), 'image.png');
        const url = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload'));
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

  it('action:image:upload api', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock('admin');
      try {
        const tokenUrl = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload-token'));
        const createToken = async () => {
          const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${jwt.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageScene: 'training-student:studentImage',
              size: tinyPng.length,
              mimeType: 'image/png',
            }),
          });
          return await tokenRes.json();
        };
        const uploadImage = async (filename: string) => {
          const tokenData = await createToken();
          const formData = new FormData();
          formData.append('token', tokenData.data.token);
          formData.append('image', new (Blob as any)([tinyPng], { type: 'image/png' }), filename);
          const url = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload'));
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

        for (const filename of ['image.png', uploadImageFilenameChinese]) {
          const data = await uploadImage(filename);
          assert.equal(data.data.filename, filename);
          assert.equal(data.data.provider, 'image-native:native');
          assert.equal(typeof data.data.url, 'string');
          assert.equal(data.data.url.length > 0, true);
          assert.equal('variants' in data.data, false);
          assert.equal('clientName' in data.data, false);
          assert.equal('imageScene' in data.data, false);
          assert.equal('status' in data.data, false);
          assert.equal('draftExpiresAt' in data.data, false);
          assert.equal('finalizedAt' in data.data, false);
        }
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:image:native direct-upload api rejected', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock('admin');
      try {
        const directUrl = app.util.getAbsoluteUrlByApiPath('/image/direct-upload');
        const directRes = await fetch(directUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageScene: 'training-student:studentImage',
            size: tinyPng.length,
            mimeType: 'image/png',
            filename: 'direct-native.png',
          }),
        });
        assert.equal(directRes.ok, false);
        assert.equal(directRes.status, 403);
        const directData = await directRes.json();
        assert.equal(
          directData.message,
          'Image provider does not support createDirectUpload: image-native:native',
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:image:direct-upload and upload-url api', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock('admin');
      const provider = await app.bean.imageProvider.get({
        providerName: 'image-cloudflare:cloudflare',
        clientName: 'default',
      });
      await app.bean.imageProvider.scope.model.imageProvider.updateById(provider.id, {
        clientOptions: {
          accountId: 'account123',
          apiToken: 'token123',
          accountHash: 'hash123',
          signingKey: 'signing-secret',
        } as any,
      });
      const resolveUploadContextRaw = app.bean.imageUploadPolicy.resolveUploadContext.bind(
        app.bean.imageUploadPolicy,
      );
      app.bean.imageUploadPolicy.resolveUploadContext = async data => {
        const context = await resolveUploadContextRaw(data);
        return {
          ...context,
          providerName: 'image-cloudflare:cloudflare',
          clientName: 'default',
        };
      };
      const fetchRaw = globalThis.fetch;
      globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? 'GET';
        if (
          url.includes('/image/upload-policy') ||
          url.includes('/image/direct-upload') ||
          url.includes('/image/upload-url')
        ) {
          return await fetchRaw(input, init);
        }
        if (url.includes('/images/v2/direct_upload') && method === 'POST') {
          return createCloudflareResponse({
            id: 'cf-direct-api-1',
            uploadURL: 'https://upload.imagedelivery.net/hash123/cf-direct-api-1',
            requireSignedURLs: true,
            draft: true,
            variants: ['https://imagedelivery.net/hash123/cf-direct-api-1/public'],
          });
        }
        if (url.includes('/images/v1/cf-direct-api-1') && method === 'GET') {
          return createCloudflareResponse({
            id: 'cf-direct-api-1',
            filename: 'direct.png',
            draft: false,
            requireSignedURLs: true,
            variants: ['https://imagedelivery.net/hash123/cf-direct-api-1/public'],
          });
        }
        if (url.includes('/images/v1') && method === 'POST') {
          return createCloudflareResponse({
            id: 'cf-upload-url-api-1',
            filename: 'image.png',
            requireSignedURLs: true,
            variants: ['https://imagedelivery.net/hash123/cf-upload-url-api-1/public'],
          });
        }
        throw new Error(`unexpected fetch: ${method} ${url}`);
      };
      try {
        const uploadPolicyUrl = app.util.getAbsoluteUrlByApiPath('/image/upload-policy');
        const uploadPolicyRes = await fetch(uploadPolicyUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageScene: 'training-record:sceneImage',
          }),
        });
        assert.equal(uploadPolicyRes.ok, true);
        const uploadPolicyData = await uploadPolicyRes.json();
        assert.equal(uploadPolicyData.data.imageScene, 'training-record:sceneImage');
        assert.equal(uploadPolicyData.data.public, false);

        const directUrl = app.util.getAbsoluteUrlByApiPath('/image/direct-upload');
        const directRes = await fetch(directUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageScene: 'training-record:sceneImage',
            size: tinyPng.length,
            mimeType: 'image/png',
            filename: 'direct.png',
          }),
        });
        assert.equal(directRes.ok, true);
        const directData = await directRes.json();
        assert.equal(directData.data.resourceId, 'cf-direct-api-1');
        assert.equal(directData.data.uploadUrl.includes('upload.imagedelivery.net'), true);
        assert.equal(directData.data.public, false);
        assert.equal('clientName' in directData.data, false);
        assert.equal('draft' in directData.data, false);
        assert.equal('imageScene' in directData.data, false);
        assert.equal('status' in directData.data, false);
        assert.equal('draftExpiresAt' in directData.data, false);

        const finalizeUrl = app.util.getAbsoluteUrlByApiPath('/image/direct-upload/finalize');
        const finalizeRes = await fetch(finalizeUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageId: directData.data.id,
          }),
        });
        assert.equal(finalizeRes.ok, true);
        const finalizeData = await finalizeRes.json();
        assert.equal(finalizeData.data.resourceId, 'cf-direct-api-1');
        assert.equal(
          finalizeData.data.url.startsWith(
            'https://imagedelivery.net/hash123/cf-direct-api-1/public',
          ),
          true,
        );
        assert.equal(finalizeData.data.url.includes('sig='), true);
        assert.equal(finalizeData.data.signed, true);
        assert.equal('clientName' in finalizeData.data, false);
        assert.equal('variants' in finalizeData.data, false);
        assert.equal('imageScene' in finalizeData.data, false);
        assert.equal('status' in finalizeData.data, false);
        assert.equal('draftExpiresAt' in finalizeData.data, false);
        assert.equal('finalizedAt' in finalizeData.data, false);

        const uploadUrl = app.util.getAbsoluteUrlByApiPath('/image/upload-url');
        const uploadUrlRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageScene: 'training-record:sceneImage',
            url: 'https://example.com/image.png',
            size: tinyPng.length,
            mimeType: 'image/png',
            filename: 'image.png',
          }),
        });
        assert.equal(uploadUrlRes.ok, true);
        const uploadUrlData = await uploadUrlRes.json();
        assert.equal(uploadUrlData.data.resourceId, 'cf-upload-url-api-1');
        assert.equal(uploadUrlData.data.public, false);
        assert.equal(uploadUrlData.data.signed, true);
        assert.equal('clientName' in uploadUrlData.data, false);
        assert.equal('variants' in uploadUrlData.data, false);
        assert.equal('imageScene' in uploadUrlData.data, false);
        assert.equal('status' in uploadUrlData.data, false);
        assert.equal('draftExpiresAt' in uploadUrlData.data, false);
        assert.equal('finalizedAt' in uploadUrlData.data, false);
      } finally {
        app.bean.imageUploadPolicy.resolveUploadContext = resolveUploadContextRaw;
        globalThis.fetch = fetchRaw;
        await app.bean.passport.signout();
      }
    });
  });
});
