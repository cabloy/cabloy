import type { EntityUser } from 'vona-module-home-user';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('authSimple.test.ts', () => {
  it('resolves and creates only the canonical simple credential relation', async () => {
    let userId: EntityUser['id'] | undefined;
    let authSimpleId: string | undefined;
    let authId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `auth-simple-test-${crypto.randomUUID()}`,
        });
        userId = user.id as EntityUser['id'];

        const service = app.scope('auth-simple').service.authSimple;
        assert.equal(await service.hasByUserId(user.id), false);

        const authSimple = await service.createForUser(user.id, 'simple-password');
        assert.ok(authSimple);
        authSimpleId = authSimple.id.toString();
        assert.equal(await service.hasByUserId(user.id), true);
        assert.ok(await service.verifyPassword(user.id, 'simple-password'));
        assert.equal(await service.verifyPassword(user.id, 'wrong-password'), undefined);

        const duplicate = await service.createForUser(user.id, 'other-password');
        assert.equal(duplicate, undefined);
        assert.ok(await service.verifyPassword(user.id, 'simple-password'));

        const simpleProvider = await app.bean.authProvider.get({
          providerName: 'auth-simple:simple',
          clientName: 'default',
        });
        const auth = await app.scope('a-auth').model.auth.get({
          userId: user.id,
          authProviderId: simpleProvider.id,
        });
        assert.ok(auth);
        authId = auth.id.toString();
      });
    } finally {
      if (userId) {
        await app.bean.executor.mockCtx(async () => {
          const authScope = app.scope('a-auth');
          const authSimpleScope = app.scope('auth-simple');
          if (authId) await authScope.model.auth.deleteById(authId);
          if (authSimpleId) await authSimpleScope.model.authSimple.deleteById(authSimpleId);
          await app.bean.user.removeById(userId!);
        });
      }
    }
  });
});
