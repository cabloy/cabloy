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
    });
  });
});
