import type { IFileProviderCloudflareClientOptions } from 'vona-module-file-cloudflare';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('fileProvider.test.ts', () => {
  it('action:fileProvider:client options', async () => {
    await app.bean.executor.mockCtx(async () => {
      const nativeRes = await app.bean.fileProvider.getClientOptions({
        providerName: 'file-native:native',
        clientName: 'default',
      });
      assert.equal(nativeRes.entityFileProvider?.providerName, 'file-native:native');
      assert.equal(nativeRes.entityFileProvider?.clientName, 'default');
      assert.equal(!!nativeRes.beanFullName, true);
      assert.equal(nativeRes.clientOptions?.signedDeliveryKind, 'proxy');
      assert.equal(nativeRes.clientOptions?.public, false);

      const cloudflare = await app.bean.fileProvider.get({
        providerName: 'file-cloudflare:cloudflare',
        clientName: 'default',
      });
      const cloudflareClientOptions: IFileProviderCloudflareClientOptions = {
        endpoint: 'https://account123.r2.cloudflarestorage.com',
        accessKeyId: 'access-key',
        secretAccessKey: 'secret-key',
        bucket: 'bucket-a',
        deliveryBaseUrl: 'https://cdn.example.com/files',
        public: true,
      };
      await app.bean.fileProvider.scope.model.fileProvider.updateById(cloudflare.id, {
        clientOptions: cloudflareClientOptions,
      });
      const cloudflareRes = await app.bean.fileProvider.getClientOptions({
        providerName: 'file-cloudflare:cloudflare',
        clientName: 'default',
      });
      assert.equal(cloudflareRes.clientOptions?.signedDeliveryKind, 'provider');
      assert.equal(cloudflareRes.clientOptions?.bucket, 'bucket-a');
      assert.equal(cloudflareRes.clientOptions?.deliveryBaseUrl, 'https://cdn.example.com/files');
      assert.equal(cloudflareRes.clientOptions?.public, true);
    });
  });
});
