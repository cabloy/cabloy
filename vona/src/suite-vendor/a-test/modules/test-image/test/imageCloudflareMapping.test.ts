import { catchError } from '@cabloy/utils';
import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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

describe('imageCloudflareMapping.test.ts', () => {
  it('action:image:cloudflare mapping', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: Array<{ method: string; url: string }> = [];
      const fetchRaw = globalThis.fetch;
      globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? 'GET';
        calls.push({ method, url });
        if (url.includes('/images/v2/direct_upload') && method === 'POST') {
          return createCloudflareResponse({
            id: 'cf-direct-1',
            uploadURL: 'https://upload.imagedelivery.net/hash123/cf-direct-1',
            requireSignedURLs: true,
            draft: true,
            variants: ['https://imagedelivery.net/hash123/cf-direct-1/public'],
          });
        }
        if (url.includes('/images/v1/') && method === 'GET') {
          return createCloudflareResponse({
            id: 'cf-direct-1',
            filename: 'direct.txt',
            draft: false,
            requireSignedURLs: true,
            variants: ['https://imagedelivery.net/hash123/cf-direct-1/public'],
          });
        }
        if (url.includes('/images/v1') && method === 'POST') {
          const id = `cf-upload-${calls.filter(item => item.method === 'POST').length}`;
          return createCloudflareResponse({
            id,
            filename: 'cloudflare.txt',
            requireSignedURLs: false,
            variants: [`https://imagedelivery.net/hash123/${id}/public`],
          });
        }
        if (url.includes('/images/v1/') && method === 'DELETE') {
          return createCloudflareResponse({ id: 'cf-upload-1' });
        }
        throw new Error(`unexpected fetch: ${method} ${url}`);
      };
      const file = path.join(os.tmpdir(), 'test-image-cloudflare.txt');
      await fse.writeFile(file, 'hello cloudflare');
      try {
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
        assert.equal(image.resourceId, 'cf-upload-1');
        assert.equal(image.deliveryBaseUrl, 'https://imagedelivery.net/hash123');
        assert.deepEqual(image.variants?.original ?? {}, {});

        const namedUrl = await app.bean.image.getVariantUrl(image.id, 'original');
        assert.equal(namedUrl, 'https://imagedelivery.net/hash123/cf-upload-1/public');

        const customUrl = await app.bean.image.getVariantUrl(image.id, {
          transformOptions: { width: 320, height: 180, fit: 'cover' },
        });
        assert.equal(
          customUrl,
          'https://imagedelivery.net/hash123/cf-upload-1/w=320,h=180,fit=cover',
        );

        const signedUrl = await app.bean.image.getVariantUrl(image.id, 'original', {
          signed: true,
          expiresIn: 600,
        });
        assert.equal(
          signedUrl.startsWith('https://imagedelivery.net/hash123/cf-upload-1/public?exp='),
          true,
        );
        assert.equal(signedUrl.includes('&sig='), true);

        const download = await app.bean.image.download(image.id, 'original', {
          signed: true,
          expiresIn: 600,
        });
        assert.equal(download.kind, 'url');
        assert.equal(download.signed, true);
        assert.equal(download.url?.includes('sig='), true);

        const directUpload = await app.bean.image.createDirectUpload(
          'image-cloudflare:cloudflare',
          {
            filename: 'direct.txt',
            requireSignedURLs: true,
            customId: 'custom/direct-path',
          },
          {
            clientName: 'default',
          },
        );
        assert.equal(directUpload.resourceId, 'cf-direct-1');
        assert.equal(
          directUpload.uploadUrl,
          'https://upload.imagedelivery.net/hash123/cf-direct-1',
        );
        assert.equal(directUpload.draft, true);
        assert.equal(directUpload.status, 'draft');
        assert.equal(directUpload.requireSignedURLs, true);
        assert.equal(directUpload.draftExpiresAt instanceof Date, true);

        const [draftUrl, draftErr] = await catchError(() =>
          app.bean.image.getVariantUrl(directUpload.id, 'original'),
        );
        assert.equal(draftUrl, undefined);
        assert.equal(draftErr?.code, 403);

        const finalizeBeforeReadyRaw = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
          const url = String(input);
          const method = init?.method ?? 'GET';
          calls.push({ method, url });
          if (url.includes('/images/v1/cf-direct-1') && method === 'GET') {
            return createCloudflareResponse({
              id: 'cf-direct-1',
              filename: 'direct.txt',
              draft: true,
              requireSignedURLs: true,
              variants: ['https://imagedelivery.net/hash123/cf-direct-1/public'],
            });
          }
          return await fetchRaw(input, init);
        };
        const [finalizePending, finalizePendingErr] = await catchError(() =>
          app.bean.image.finalizeDirectUpload(directUpload.id),
        );
        assert.equal(finalizePending, undefined);
        assert.equal(finalizePendingErr?.code, 403);
        globalThis.fetch = finalizeBeforeReadyRaw;

        const finalizedDirectUpload = await app.bean.image.finalizeDirectUpload(directUpload.id);
        assert.equal(finalizedDirectUpload.status, 'ready');
        assert.equal(finalizedDirectUpload.filename, 'direct.txt');
        assert.equal(finalizedDirectUpload.finalizedAt instanceof Date, true);
        const finalizedDirectUrl = await app.bean.image.getVariantUrl(directUpload.id, 'original');
        assert.equal(
          finalizedDirectUrl.startsWith('https://imagedelivery.net/hash123/cf-direct-1/public'),
          true,
        );
        assert.equal(finalizedDirectUrl.includes('sig='), true);

        const uploadedByUrl = await app.bean.image.uploadUrl(
          'image-cloudflare:cloudflare',
          {
            url: 'https://example.com/cloudflare.txt',
            filename: 'cloudflare-from-url.txt',
            requireSignedURLs: true,
          },
          {
            clientName: 'default',
          },
        );
        assert.equal(uploadedByUrl.resourceId.startsWith('cf-upload-'), true);

        await app.bean.image.delete(image.id);
        assert.equal(
          calls.some(item => item.method === 'DELETE'),
          true,
        );
      } finally {
        globalThis.fetch = fetchRaw;
        await fse.remove(file);
      }
    });
  });
});
