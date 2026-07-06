import { catchError } from '@cabloy/utils';
import fse from 'fs-extra';
import assert from 'node:assert';
import { Blob } from 'node:buffer';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
  'base64',
);

describe('imageNative.test.ts', () => {
  it('action:image:native upload/get/delete', async () => {
    await app.bean.executor.mockCtx(async () => {
      const file = path.join(os.tmpdir(), 'test-image-native.png');
      await fse.writeFile(file, tinyPng);
      const image = await app.bean.image.upload(
        'image-native:native',
        {
          file,
          filename: 'hello.png',
          contentType: 'image/png',
        },
        {
          clientName: 'default',
          clientOptions: {
            variants: {
              original: {},
              thumbnail: { width: 64, height: 64, fit: 'cover' },
            },
          },
        },
      );
      assert.equal(image.provider, 'image-native:native');
      assert.equal(image.filename, 'hello.png');
      assert.deepEqual(image.variants?.thumbnail, { width: 64, height: 64, fit: 'cover' });
      const image2 = await app.bean.image.get(image.id);
      assert.equal(image2?.resourceId, image.resourceId);
      const thumbnailPath = path.join(
        path.dirname(image.storagePath!),
        `${image.resourceId}__thumbnail${path.extname(image.storagePath!)}`,
      );
      assert.equal(await fse.pathExists(thumbnailPath), false);
      const originalUrl = await app.bean.image.getVariantUrl(image.id, 'original');
      assert.equal(originalUrl.includes('/api/static/'), true);
      const namedUrl = await app.bean.image.getVariantUrl(image.id, 'thumbnail');
      assert.equal(namedUrl.includes('__thumbnail'), true);
      assert.equal(await fse.pathExists(thumbnailPath), true);
      const customUrl = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 32, height: 32, fit: 'cover' },
      });
      assert.equal(customUrl.includes('__t_'), true);
      const customUrl2 = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 32, height: 32, fit: 'cover' },
      });
      assert.equal(customUrl, customUrl2);

      const signedUrl = await app.bean.image.getVariantUrl(image.id, 'original', {
        signed: true,
        expiresAt: Date.now() + 600_000,
      });
      assert.equal(signedUrl.includes('/image/delivery/'), true);
      assert.equal(signedUrl.includes('token='), true);

      const view = await app.bean.image.resolveView(image.id, 'thumbnail');
      assert.equal(view?.id, image.id);
      assert.equal(view?.url.includes('__thumbnail'), true);
      assert.equal(view?.provider, 'image-native:native');
      assert.equal(view?.clientName, 'default');
      assert.equal(view?.signed, false);
      assert.deepEqual(view?.variants?.thumbnail, { width: 64, height: 64, fit: 'cover' });

      const signedView = await app.bean.image.resolveView(image.id, 'original', undefined, {
        signed: true,
        expiresIn: 600,
      });
      assert.equal(signedView?.url.includes('/image/delivery/'), true);
      assert.equal(signedView?.url.includes('token='), true);
      assert.equal(signedView?.signed, true);

      const [viewSceneMismatch, viewSceneMismatchErr] = await catchError(() =>
        app.bean.image.resolveView(image.id, 'original', 'training-student:studentImage'),
      );
      assert.equal(viewSceneMismatch, undefined);
      assert.equal(viewSceneMismatchErr?.message.includes('image scene mismatch'), true);

      const resolvedUndefined = await app.bean.image.resolveView(undefined, 'original');
      assert.equal(resolvedUndefined, undefined);
      const resolvedViewsUndefined = await app.bean.image.resolveViews(undefined, 'original');
      assert.equal(resolvedViewsUndefined, undefined);
      const resolvedViewsEmpty = await app.bean.image.resolveViews([], 'original');
      assert.deepEqual(resolvedViewsEmpty, []);
      const resolvedViews = await app.bean.image.resolveViews([image.id, 999999], 'original');
      assert.equal(resolvedViews?.length, 1);
      assert.equal(resolvedViews?.[0].id, image.id);

      const download = await app.bean.image.download(image.id, 'original');
      assert.equal(download.kind, 'buffer');

      const signedDownload = await app.bean.image.download(image.id, 'original', {
        signed: true,
        expiresIn: 600,
      });
      assert.equal(signedDownload.kind, 'url');
      assert.equal(signedDownload.signed, true);
      assert.equal(signedDownload.url?.includes('/image/delivery/'), true);

      await app.bean.image.delete(image.id);
      const image3 = await app.bean.image.get(image.id);
      assert.equal(image3, undefined);
      await fse.remove(file);
    });
  });

  it('action:image:native direct upload/finalize', async () => {
    await app.bean.executor.mockCtx(async () => {
      const direct = await app.bean.image.createDirectUpload(
        'image-native:native',
        {
          filename: 'direct-native.png',
          contentType: 'image/png',
        },
        {
          clientName: 'default',
          imageScene: 'training-student:studentImage',
          clientOptions: {
            variants: {
              original: {},
              thumbnail: { width: 64, height: 64, fit: 'cover' },
            },
          },
        },
      );
      assert.equal(direct.provider, 'image-native:native');
      assert.equal(direct.status, 'draft');
      assert.equal(direct.uploadUrl.includes('/image-native/direct-upload/'), true);

      const [finalizeBeforeUpload, finalizeBeforeUploadErr] = await catchError(() =>
        app.bean.image.finalizeDirectUpload(direct.id),
      );
      assert.equal(finalizeBeforeUpload, undefined);
      assert.equal(finalizeBeforeUploadErr?.code, 403);

      const uploadForm = new FormData();
      uploadForm.append(
        'image',
        new (Blob as any)([tinyPng], { type: 'image/png' }),
        'direct-native.png',
      );
      const uploadRes = await fetch(direct.uploadUrl, {
        method: 'POST',
        body: uploadForm,
      });
      assert.equal(uploadRes.ok, true);

      const finalized = await app.bean.image.finalizeDirectUpload(direct.id);
      assert.equal(finalized.status, 'ready');
      assert.equal(!!finalized.finalizedAt, true);
      assert.equal(finalized.width, 1);
      assert.equal(finalized.height, 1);
      assert.equal(!!finalized.storagePath, true);

      const originalUrl = await app.bean.image.getVariantUrl(finalized.id, 'original');
      assert.equal(originalUrl.includes('/api/static/'), true);
      const thumbnailUrl = await app.bean.image.getVariantUrl(finalized.id, 'thumbnail');
      assert.equal(thumbnailUrl.includes('__thumbnail'), true);

      await app.bean.image.delete(finalized.id);
      const imageDeleted = await app.bean.image.get(finalized.id);
      assert.equal(imageDeleted, undefined);
    });
  });
});
