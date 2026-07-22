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
      let directUploadDraft = true;
      const imageCloudflareFetch: typeof globalThis.fetch = async (input, init) => {
        const url = String(input);
        const method = init?.method ?? 'GET';
        calls.push({ method, url });
        if (url.includes('/images/v2/direct_upload') && method === 'POST') {
          return createCloudflareResponse({
            id: 'cf-direct-1',
            uploadURL: 'https://upload.imagedelivery.net/hash123/cf-direct-1',
            public: false,
            draft: true,
            variants: ['https://imagedelivery.net/hash123/cf-direct-1/public'],
          });
        }
        if (url.includes('/images/v1/') && method === 'GET') {
          return createCloudflareResponse({
            id: 'cf-direct-1',
            filename: 'direct.txt',
            draft: directUploadDraft,
            public: false,
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
      const file = path.join(os.tmpdir(), `test-image-cloudflare-${crypto.randomUUID()}.txt`);
      const imageIds: number[] = [];
      await fse.writeFile(file, 'hello cloudflare');
      try {
        app.ctx.state.imageCloudflareFetch = imageCloudflareFetch;
        const clientOptions = {
          accountId: 'account123',
          apiToken: 'token123',
          accountHash: 'hash123',
          signingKey: 'signing-secret',
        };

        const image = await app.bean.image.upload(
          'image-cloudflare:cloudflare',
          {
            file,
            filename: 'cloudflare.txt',
            contentType: 'text/plain',
          },
          {
            clientName: 'default',
            clientOptions,
          },
        );
        imageIds.push(image.id);
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

        const view = await app.bean.image.resolveView(image.id, 'original');
        assert.equal(view?.id, image.id);
        assert.equal(view?.url, 'https://imagedelivery.net/hash123/cf-upload-1/public');
        assert.equal(view?.signed, false);
        assert.equal('provider' in (view ?? {}), false);
        assert.equal('resourceId' in (view ?? {}), false);
        assert.equal('uploadedAt' in (view ?? {}), false);
        assert.equal('clientName' in (view ?? {}), false);
        assert.equal('variants' in (view ?? {}), false);
        assert.equal('imageScene' in (view ?? {}), false);
        assert.equal('status' in (view ?? {}), false);
        assert.equal('draftExpiresAt' in (view ?? {}), false);
        assert.equal('finalizedAt' in (view ?? {}), false);

        const download = await app.bean.image.download(image.id, 'original');
        assert.equal(download.kind, 'url');
        assert.equal(download.signed, false);
        assert.equal(download.url?.includes('sig='), false);

        const directUpload = await app.bean.image.createDirectUpload(
          'image-cloudflare:cloudflare',
          {
            filename: 'direct.txt',
            customId: 'custom/direct-path',
          },
          {
            clientName: 'default',
            clientOptions: { ...clientOptions, public: false },
          },
        );
        imageIds.push(directUpload.id);
        assert.equal('provider' in directUpload, false);
        assert.equal('resourceId' in directUpload, false);
        assert.equal('uploadedAt' in directUpload, false);
        assert.equal(
          directUpload.uploadUrl,
          'https://upload.imagedelivery.net/hash123/cf-direct-1',
        );
        assert.equal(directUpload.public, false);
        assert.equal('draft' in directUpload, false);
        assert.equal('status' in directUpload, false);
        assert.equal('draftExpiresAt' in directUpload, false);

        const [draftUrl, draftErr] = await catchError(() =>
          app.bean.image.getVariantUrl(directUpload.id, 'original'),
        );
        assert.equal(draftUrl, undefined);
        assert.equal(draftErr?.code, 403);

        const [finalizePending, finalizePendingErr] = await catchError(() =>
          app.bean.image.finalizeDirectUpload(directUpload.id),
        );
        assert.equal(finalizePending, undefined);
        assert.equal(finalizePendingErr?.code, 403);
        directUploadDraft = false;

        const finalizedDirectUpload = await app.bean.image.finalizeDirectUpload(directUpload.id);
        assert.equal(finalizedDirectUpload.filename, 'direct.txt');
        assert.equal(finalizedDirectUpload.status, 'ready');
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
          },
          {
            clientName: 'default',
            clientOptions: { ...clientOptions, public: false },
          },
        );
        imageIds.push(uploadedByUrl.id);
        assert.equal(uploadedByUrl.resourceId.startsWith('cf-upload-'), true);

        await app.bean.image.delete(image.id);
        assert.equal(
          calls.some(item => item.method === 'DELETE'),
          true,
        );
      } finally {
        for (const imageId of imageIds.toReversed()) {
          await app.bean.image.scope.model.image.deleteById(imageId);
        }
        await fse.remove(file);
      }
    });
  });
});
