import type { IJwtCreateOptions, IPayloadData } from 'vona-module-a-jwt';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('jwt.test.ts', () => {
  it('paired expiry is independent and reports the effective access lifetime', async () => {
    await app.bean.executor.mockCtx(async () => {
      const bean = app.bean.jwt;
      const access = bean.get('access');
      const refresh = bean.get('refresh');
      const lifetime = (token: string) => {
        const payload = access.instance.decode(token) as { iat: number; exp: number };
        return payload.exp - payload.iat;
      };
      const accessDefault = access.getExpiresIn();
      const refreshDefault = refresh.getExpiresIn();
      const tempDefault = access.getExpiresIn({ temp: true });
      const cases: Array<[IJwtCreateOptions | undefined, number, number]> = [
        [undefined, accessDefault, refreshDefault],
        [{ accessExpiresIn: 37 }, 37, refreshDefault],
        [{ refreshExpiresIn: '2m' }, accessDefault, 120],
        [{ accessExpiresIn: '45s', refreshExpiresIn: 91 }, 45, 91],
        [{ dev: true }, refreshDefault, refreshDefault],
        [{ dev: true, temp: true }, tempDefault, tempDefault],
        [{ dev: true, temp: true, accessExpiresIn: 31, refreshExpiresIn: '3m' }, 31, 180],
      ];
      for (const [options, accessTtl, refreshTtl] of cases) {
        const pair = await bean.create({ userId: 1, authId: 1 }, options);
        assert.equal(lifetime(pair.accessToken), accessTtl);
        assert.equal(lifetime(pair.refreshToken), refreshTtl);
        assert.equal(pair.expiresIn, accessTtl);
      }
      const temporary = await bean.createTempAuthToken({}, { expiresIn: '25s' });
      assert.equal(lifetime(temporary), 25);
    });
  });

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
      // path binding
      const client = app.bean.jwt.get('access');
      const exactToken = await client.sign(payloadData, { path: '/api/file/download' });
      assert.deepEqual(
        await client.verify(exactToken, { path: '/api/file/download' }),
        payloadData,
      );
      const [_, exactError] = await catchError(() => {
        return client.verify(exactToken, { path: '/api/file/download/1' });
      });
      assert.equal(exactError?.code, 401);

      const arrayToken = await client.sign(payloadData, {
        path: ['/api/file/download/1', '/api/file/download/2'],
      });
      assert.deepEqual(
        await client.verify(arrayToken, { path: '/api/file/download/2' }),
        payloadData,
      );

      const [__, endpointError] = await catchError(() => {
        return client.verify(exactToken, { path: '/api/file/download-other' });
      });
      assert.equal(endpointError?.code, 401);

      // create jwt token
      const jwtToken = await app.bean.jwt.create(payloadData);
      assert.equal(!!jwtToken.accessToken, true);
    });
  });
});
