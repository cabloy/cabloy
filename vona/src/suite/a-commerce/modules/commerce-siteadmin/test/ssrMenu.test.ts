import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const menuNames = [
  'commerce-catalog:category#category',
  'commerce-catalog:product#product',
  'commerce-catalog:sku#sku',
];

async function retrieveMenus() {
  const menus = await app.bean.ssr.retrieveMenus('commerce-admin');
  assert.ok(menus);
  return menus;
}

describe('ssrMenu.test.ts', () => {
  it('exposes Catalog resource menus only to system administrators', async () => {
    await app.bean.executor.mockCtx(async () => {
      const menusAnonymous = await retrieveMenus();
      for (const menuName of menuNames) {
        assert.equal(
          menusAnonymous.menus?.some(menu => menu.name === menuName),
          false,
        );
      }

      try {
        await app.bean.passport.signinMock('admin');
        const menusSystemAdmin = await retrieveMenus();
        const catalog = menusSystemAdmin.groups?.find(
          group => group.name === 'commerce-siteadmin:catalog',
        );
        assert.ok(catalog);

        const menuCategory = menusSystemAdmin.menus?.find(
          menu => menu.name === 'commerce-catalog:category#category',
        );
        assert.equal(menuCategory?.group, catalog.name);
        assert.equal(menuCategory?.meta?.params?.resource, 'commerce-catalog:category');

        const menuProduct = menusSystemAdmin.menus?.find(
          menu => menu.name === 'commerce-catalog:product#product',
        );
        assert.equal(menuProduct?.group, catalog.name);
        assert.equal(menuProduct?.meta?.params?.resource, 'commerce-catalog:product');

        const menuSku = menusSystemAdmin.menus?.find(
          menu => menu.name === 'commerce-catalog:sku#sku',
        );
        assert.equal(menuSku?.group, catalog.name);
        assert.equal(menuSku?.meta?.params?.resource, 'commerce-catalog:sku');
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
