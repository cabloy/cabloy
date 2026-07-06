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
      const tokenUrl = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload-token'));
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
      const tokenData = await tokenRes.json();
      const formData = new FormData();
      formData.append('token', tokenData.data.token);
      formData.append('image', new (Blob as any)([tinyPng], { type: 'image/png' }), 'image.png');
      const url = app.util.getAbsoluteUrlByApiPath($apiPath('/image/upload'));
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        body: formData,
      });
      assert.equal(res.ok, true);
      const data = await res.json();
      assert.equal(data.data.filename, 'image.png');
      assert.equal(data.data.provider, 'image-native:native');
      assert.deepEqual(data.data.variants.original, {});
      assert.equal(typeof data.data.url, 'string');
      assert.equal(data.data.url.length > 0, true);
      await app.bean.passport.signout();
    });
  });

  it('action:image:native direct-upload api', async () => {
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
        assert.equal(directRes.ok, true);
        const directData = await directRes.json();
        assert.equal(directData.data.provider, 'image-native:native');
        assert.equal(directData.data.status, 'draft');
        assert.equal(directData.data.uploadUrl.includes('/image-native/direct-upload/'), true);

        const uploadForm = new FormData();
        uploadForm.append(
          'image',
          new (Blob as any)([tinyPng], { type: 'image/png' }),
          'direct-native.png',
        );
        const uploadRes = await fetch(directData.data.uploadUrl, {
          method: 'POST',
          body: uploadForm,
        });
        assert.equal(uploadRes.ok, true);

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
        assert.equal(finalizeData.data.provider, 'image-native:native');
        assert.equal(finalizeData.data.status, 'ready');
        assert.equal(finalizeData.data.url.includes('/api/static/'), true);
        assert.equal(finalizeData.data.signed, false);
        assert.equal(!!finalizeData.data.finalizedAt, true);
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
        if (url.includes('/image/direct-upload') || url.includes('/image/upload-url')) {
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
            filename: 'direct.png',
            requireSignedURLs: true,
          }),
        });
        assert.equal(directRes.ok, true);
        const directData = await directRes.json();
        assert.equal(directData.data.resourceId, 'cf-direct-api-1');
        assert.equal(directData.data.uploadUrl.includes('upload.imagedelivery.net'), true);
        assert.equal(directData.data.requireSignedURLs, true);
        assert.equal(directData.data.status, 'draft');
        assert.equal(!!directData.data.draftExpiresAt, true);

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
        assert.equal(finalizeData.data.status, 'ready');
        assert.equal(
          finalizeData.data.url.startsWith(
            'https://imagedelivery.net/hash123/cf-direct-api-1/public',
          ),
          true,
        );
        assert.equal(finalizeData.data.url.includes('sig='), true);
        assert.equal(finalizeData.data.signed, true);
        assert.equal(!!finalizeData.data.finalizedAt, true);

        const uploadUrl = app.util.getAbsoluteUrlByApiPath('/image/upload-url');
        const uploadUrlRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageScene: 'training-student:studentImage',
            url: 'https://example.com/image.png',
            size: tinyPng.length,
            mimeType: 'image/png',
            filename: 'image.png',
            requireSignedURLs: true,
          }),
        });
        assert.equal(uploadUrlRes.ok, true);
        const uploadUrlData = await uploadUrlRes.json();
        assert.equal(uploadUrlData.data.resourceId, 'cf-upload-url-api-1');
        assert.equal(uploadUrlData.data.requireSignedURLs, true);
        assert.equal(uploadUrlData.data.signed, true);
      } finally {
        app.bean.imageUploadPolicy.resolveUploadContext = resolveUploadContextRaw;
        globalThis.fetch = fetchRaw;
        await app.bean.passport.signout();
      }
    });
  });
});
