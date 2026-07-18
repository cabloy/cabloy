import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('meta.version.test.ts', () => {
  it('init:version:1 preserves existing grants and appends Commerce site access once', async () => {
    await app.bean.executor.mockCtx(async () => {
      const modelRole = app.scope('home-user').model.role;
      const roleRegisteredUser = await modelRole.getByName('registeredUser');
      const roleSystemAdmin = await modelRole.getByName('systemAdmin');
      assert.ok(roleRegisteredUser);
      assert.ok(roleSystemAdmin);
      const registeredUserSiteIdsOriginal = roleRegisteredUser.siteIds;
      const systemAdminSiteIdsOriginal = roleSystemAdmin.siteIds;
      try {
        await modelRole.updateById(roleRegisteredUser.id, { siteIds: ['web', 'customSite'] });
        await modelRole.updateById(roleSystemAdmin.id, {
          siteIds: ['web', 'admin', 'customSite', 'commerce'],
        });

        const metaVersion = app.scope('commerce-siteadmin').meta.version;
        await metaVersion.init({ version: 1 });
        await metaVersion.init({ version: 1 });

        const registeredUser = await modelRole.getByName('registeredUser');
        assert.deepEqual(registeredUser?.siteIds, ['web', 'customSite', 'commerce']);

        const systemAdmin = await modelRole.getByName('systemAdmin');
        assert.deepEqual(systemAdmin?.siteIds, [
          'web',
          'admin',
          'customSite',
          'commerce',
          'commerceAdmin',
        ]);
      } finally {
        await modelRole.updateById(roleRegisteredUser.id, {
          siteIds: registeredUserSiteIdsOriginal,
        });
        await modelRole.updateById(roleSystemAdmin.id, { siteIds: systemAdminSiteIdsOriginal });
      }
    });
  });
});
