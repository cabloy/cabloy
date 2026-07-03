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
      await app.bean.imageProvider.scope.model.imageProvider.updateById(cloudflare.id, {
        clientOptions: {
          accountId: 'account123',
          apiToken: 'token123',
          accountHash: 'hash123',
        } as any,
      });
      const resCloudflare = await app.bean.imageProvider.getClientOptions({
        providerName: 'image-cloudflare:cloudflare',
        clientName: 'default',
      });
      assert.equal(resCloudflare.clientOptions?.signedDeliveryKind, 'provider');
      assert.equal((resCloudflare.clientOptions as any)?.accountHash, 'hash123');
      assert.equal((resCloudflare.clientOptions as any)?.accountId, 'account123');
    });
  });
});
