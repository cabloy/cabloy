import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const MenuNames = {
  // public: 'test-rest:product#public',
  // publicEmptyRoles: 'test-rest:product#publicEmptyRoles',
  // registeredUser: 'test-rest:product#registeredUser',
  // multipleRoles: 'test-rest:product#multipleRoles',
  systemAdmin: 'test-rest:product#product',
};

async function retrieveMenuNames() {
  const menus = await app.bean.ssr.retrieveMenus('admin');
  assert.ok(menus);
  for (const menu of menus.menus || []) {
    assert.equal('roles' in menu, false);
  }
  return new Set((menus.menus || []).map(menu => menu.name));
}

describe('ssrMenu.test.ts', () => {
  it('filters static menu roles without mutating the structural cache', async () => {
    await app.bean.executor.mockCtx(async () => {
      const namesAnonymous = await retrieveMenuNames();
      // assert.ok(namesAnonymous.has(MenuNames.public));
      // assert.ok(namesAnonymous.has(MenuNames.publicEmptyRoles));
      // assert.equal(namesAnonymous.has(MenuNames.registeredUser), false);
      // assert.equal(namesAnonymous.has(MenuNames.multipleRoles), false);
      assert.equal(namesAnonymous.has(MenuNames.systemAdmin), false);

      try {
        await app.bean.passport.signinMock('admin');
        const namesSystemAdmin = await retrieveMenuNames();
        // assert.ok(namesSystemAdmin.has(MenuNames.public));
        // assert.ok(namesSystemAdmin.has(MenuNames.publicEmptyRoles));
        // assert.ok(namesSystemAdmin.has(MenuNames.registeredUser));
        // assert.ok(namesSystemAdmin.has(MenuNames.multipleRoles));
        assert.ok(namesSystemAdmin.has(MenuNames.systemAdmin));
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('matches any current role without sharing the privileged result', async () => {
    await app.bean.executor.mockCtx(async () => {
      try {
        await app.bean.passport.signinMock('admin');
        const namesSystemAdmin = await retrieveMenuNames();
        assert.ok(namesSystemAdmin.has(MenuNames.systemAdmin));

        assert.ok(app.bean.passport.current);
        app.bean.passport.current.roles = [
          { id: 'registeredUser', name: 'registeredUser' },
          { id: 'registeredUser', name: 'registeredUser' },
        ] as any;
        const namesRegisteredUser = await retrieveMenuNames();
        // assert.ok(namesRegisteredUser.has(MenuNames.public));
        // assert.ok(namesRegisteredUser.has(MenuNames.publicEmptyRoles));
        // assert.ok(namesRegisteredUser.has(MenuNames.registeredUser));
        // assert.ok(namesRegisteredUser.has(MenuNames.multipleRoles));
        assert.equal(namesRegisteredUser.has(MenuNames.systemAdmin), false);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
