import type {
  DtoSerializerArray,
  DtoSerializerLazy,
  DtoSerializerSimple,
} from 'vona-module-test-vona';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('serializer.test.ts', () => {
  const dataSimple = {
    password: '123456',
    password2: '123456',
    email: 'kevin@cabloy.com',
    email2: 'kevin@cabloy.com',
    email3: 'kevin@cabloy.com',
    email4: 'kevin@cabloy.com',
    email5: 'kevin@cabloy.com',
    email6: 'kevin@cabloy.com',
    email7: 'kevin@cabloy.com',
    firstName: 'k',
    lastName: 'v',
  } as DtoSerializerSimple;
  it('action:serializerSimple', async () => {
    await app.bean.executor.mockCtx(async () => {
      const res: DtoSerializerSimple = await app.bean.executor.performAction(
        'post',
        '/test/vona/serializer/echoSimple',
        {
          body: dataSimple,
        },
      );
      assert.equal(res.password, undefined);
      assert.equal(res.password2, undefined);
      assert.equal(res.email, 'k****n@cabloy.com');
      assert.equal(res.email2, 'k****n@cabloy.com');
      assert.equal(res.email3, 'k****n@cabloy.com');
      assert.equal(res.email4, 'k****n@cabloy.com');
      assert.equal(res.email5, 'k****n@cabloy.com');
      assert.equal(res.email6, 'k****n@cabloy.com');
      assert.equal(res.email7, 'k****n@cabloy.com');
      assert.equal(res.fullName, 'k v');
      assert.equal(res.fullName2, 'k v');
      assert.equal(res.fullName3, 'k v');
      assert.equal(res.fullName4, 'k v');
    });
  });
  it('action:serializerArray', async () => {
    await app.bean.executor.mockCtx(async () => {
      const res: DtoSerializerArray[] = await app.bean.executor.performAction(
        'post',
        '/test/vona/serializer/echoArray',
        {
          body: [{ simples: [dataSimple], simplesLazy: [dataSimple] }],
        },
      );
      assert.equal(res[0].simples[0].password, '111111');
      assert.equal(res[0].simples[0].password2, undefined);
      assert.equal(res[0].simplesLazy[0].password, '111111');
      assert.equal(res[0].simplesLazy[0].password2, undefined);
    });
  });
  it('action:serializerLazy', async () => {
    await app.bean.executor.mockCtx(async () => {
      const res: DtoSerializerLazy = await app.bean.executor.performAction(
        'post',
        '/test/vona/serializer/echoLazy',
        {
          body: {
            simple: dataSimple,
            simpleLazy: dataSimple,
          },
        },
      );
      assert.equal(res.simple.password, '111111');
      assert.equal(res.simple.password2, undefined);
      assert.equal(res.simpleLazy.password, '111111');
      assert.equal(res.simpleLazy.password2, undefined);
    });
  });
});
