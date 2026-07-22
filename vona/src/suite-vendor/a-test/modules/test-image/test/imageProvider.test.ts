import type { IImageProviderCloudflareClientOptions } from 'vona-module-image-cloudflare';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('imageProvider.test.ts', () => {
  it('action:imageProvider:client options', async () => {
    await app.bean.executor.mockCtx(async () => {
      const res = await app.bean.imageProvider.getClientOptions({
        providerName: 'image-native:native',
        clientName: 'default',
      });
      assert.equal(res.entityImageProvider?.providerName, 'image-native:native');
      assert.equal(res.entityImageProvider?.clientName, 'default');
      assert.equal(!!res.beanFullName, true);
      assert.deepEqual(res.clientOptions?.variants?.original ?? {}, {});
      assert.equal(res.clientOptions?.signedDeliveryKind, 'proxy');

      const cloudflare = await app.bean.imageProvider.get({
        providerName: 'image-cloudflare:cloudflare',
        clientName: 'default',
      });
      const cloudflareClientOptions: IImageProviderCloudflareClientOptions = {
        accountId: 'account123',
        apiToken: 'token123',
        accountHash: 'hash123',
      };
      await app.bean.imageProvider.scope.model.imageProvider.updateById(cloudflare.id, {
        clientOptions: cloudflareClientOptions,
      });
      const resCloudflare = await app.bean.imageProvider.getClientOptions({
        providerName: 'image-cloudflare:cloudflare',
        clientName: 'default',
      });
      assert.equal(resCloudflare.clientOptions?.signedDeliveryKind, 'provider');
      assert.equal(resCloudflare.clientOptions?.accountHash, 'hash123');
      assert.equal(resCloudflare.clientOptions?.accountId, 'account123');
    });
  });
});
