import { catchError } from '@cabloy/utils';
import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
  'base64',
);

describe('imageNative.test.ts', () => {
  it('action:image:native private upload/get/delete', async () => {
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
      assert.equal(image.public, false);
      assert.deepEqual(image.variants?.thumbnail, { width: 64, height: 64, fit: 'cover' });
      assert.equal(image.storagePath?.includes(`${path.sep}public${path.sep}`), false);
      const image2 = await app.bean.image.get(image.id);
      assert.equal(image2?.resourceId, image.resourceId);
      const thumbnailPath = path.join(
        path.dirname(image.storagePath!),
        `${image.resourceId}__thumbnail${path.extname(image.storagePath!)}`,
      );
      assert.equal(await fse.pathExists(thumbnailPath), false);

      const originalUrl = await app.bean.image.getVariantUrl(image.id, 'original');
      const originalUrlParsed = new URL(originalUrl);
      assert.equal(originalUrlParsed.pathname.endsWith('/image/delivery'), true);
      assert.equal(originalUrlParsed.searchParams.get('imageId'), String(image.id));
      assert.equal(originalUrlParsed.searchParams.has('token'), true);
      const namedUrl = await app.bean.image.getVariantUrl(image.id, 'thumbnail');
      const namedUrlParsed = new URL(namedUrl);
      assert.equal(namedUrlParsed.pathname.endsWith('/image/delivery'), true);
      assert.equal(namedUrlParsed.searchParams.get('imageId'), String(image.id));
      assert.equal(namedUrlParsed.searchParams.has('token'), true);
      assert.equal(await fse.pathExists(thumbnailPath), false);

      const signedUnauthorizedUrl = new URL(namedUrl);
      signedUnauthorizedUrl.searchParams.delete('token');
      const signedUnauthorizedRes = await fetch(signedUnauthorizedUrl);
      assert.equal(signedUnauthorizedRes.status, 401);
      const signedAuthorizedRes = await fetch(namedUrl);
      assert.equal(signedAuthorizedRes.ok, true);
      assert.equal(signedAuthorizedRes.headers.get('content-type')?.includes('image/png'), true);
      assert.equal(await fse.pathExists(thumbnailPath), true);

      await app.bean.passport.signinMock();
      const audienceView = await app.bean.image.resolveView(image.id, 'thumbnail', undefined, {
        audience: true,
      });
      const passportCode = await app.bean.passport.createTempAuthToken({
        path: '/api/image/delivery',
      });
      const audienceUrl = new URL(audienceView!.url);
      audienceUrl.searchParams.set('x-vona-passport-code', passportCode);
      const audienceAuthorizedRes = await fetch(audienceUrl);
      assert.equal(audienceAuthorizedRes.ok, true);
      await app.bean.passport.signout();
      const audienceUnauthorizedRes = await fetch(audienceView!.url);
      assert.equal(audienceUnauthorizedRes.status, 401);

      const customUrl = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 32, height: 32, fit: 'cover' },
      });
      assert.equal(customUrl.includes('/image/delivery?'), true);
      const customUrl2 = await app.bean.image.getVariantUrl(image.id, {
        transformOptions: { width: 32, height: 32, fit: 'cover' },
      });
      assert.equal(customUrl2.includes('/image/delivery?'), true);
      const customRes = await fetch(customUrl);
      assert.equal(customRes.ok, true);
      assert.equal(customRes.headers.get('content-type')?.includes('image/png'), true);

      const view = await app.bean.image.resolveView(image.id, 'thumbnail');
      assert.equal(view?.id, image.id);
      assert.equal(view?.url.includes('/image/delivery?'), true);
      assert.equal(view?.signed, true);
      assert.equal('provider' in (view ?? {}), false);
      assert.equal('resourceId' in (view ?? {}), false);
      assert.equal('uploadedAt' in (view ?? {}), false);
      assert.equal('clientName' in (view ?? {}), false);
      assert.equal('variants' in (view ?? {}), false);

      const signedView = await app.bean.image.resolveView(image.id, 'original', undefined, {
        expiresIn: 600,
      });
      assert.equal(signedView?.url.includes('/image/delivery?'), true);
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
      assert.equal(download.kind, 'url');
      assert.equal(download.signed, true);
      assert.equal(download.url?.includes('/image/delivery?'), true);

      const bufferedVariant = await app.bean.image.downloadForDelivery(image.id, 'thumbnail');
      assert.equal(bufferedVariant.kind, 'buffer');
      assert.equal(bufferedVariant.contentType, 'image/png');
      assert.equal((bufferedVariant.buffer?.length ?? 0) > 0, true);

      await app.bean.image.delete(image.id);
      const image3 = await app.bean.image.get(image.id);
      assert.equal(image3, undefined);
      await fse.remove(file);
    });
  });
});
