import type { IPayloadData } from 'vona-module-a-jwt';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('jwt.test.ts', () => {
  it('action:jwt', async () => {
    await app.bean.executor.mockCtx(async () => {
      // sign
      const payloadData: IPayloadData = { userId: 1, authId: 1 };
      const token = await app.bean.jwt.get('access').sign(payloadData);
      assert.equal(token.split('.').length, 3);
      // verify
      const [payloadDataVerified1] = await catchError(async () => {
        return await app.bean.jwt.get('refresh').verify(token);
      });
      assert.equal(payloadDataVerified1, undefined);
      // verify
      const payloadDataVerified2 = await app.bean.jwt.get('access').verify(token);
      assert.deepEqual(payloadData, payloadDataVerified2);
      // create jwt token
      const jwtToken = await app.bean.jwt.create(payloadData);
      assert.equal(!!jwtToken.accessToken, true);
    });
  });
});
