const path = require('path');
const require3 = require('require3');
const initData = require('./initData1.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: 'a-base',
    atomClassName: 'role',
  };
  const __atomClassAuthOpen = {
    module: moduleInfo.relativeName,
    atomClassName: 'authOpen',
  };
  class VersionInit {
    get modelAuthOpen() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
    }
    get localToken() {
      return ctx.bean.local.module(moduleInfo.relativeName).token;
    }

    async run(options) {
      // rights
      await this._init_rights();
      // open auth scopes
      await this._init_roleScopes();
      // RoleScopeCliDevelopment
      await this._init_rootCliDevTest();
    }

    async _init_rights() {
      // add role rights
      const roleRights = [
        { roleName: 'authenticated', action: 'create' },
        { roleName: 'authenticated', action: 'read', scopeNames: 0 },
        { roleName: 'authenticated', action: 'write', scopeNames: 0 },
        { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
        { roleName: 'authenticated', action: 'enable', scopeNames: 0 },
        { roleName: 'authenticated', action: 'disable', scopeNames: 0 },
        { roleName: 'authenticated', action: 'hideClientSecret', scopeNames: 0 },
        { roleName: 'authenticated', action: 'resetClientSecret', scopeNames: 0 },
        { roleName: 'authenticated', action: 'deleteBulk' },
        { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
      ];
      await ctx.bean.role.addRoleRightBatch({ atomClassName: 'authOpen', roleRights });
    }

    async _init_roleScopes() {
      //
      for (const roleScope of initData.roleScopes) {
        // item
        const item = { ...roleScope };
        // roleIdParent
        if (roleScope.roleIdParent === 0) {
          item.roleIdParent = 0;
        } else {
          const role = await ctx.bean.role.parseRoleName({ roleName: roleScope.roleIdParent });
          item.roleIdParent = role.id;
        }
        // loadAtomStatic
        const atomKey = await ctx.bean.atomStatic.loadAtomStatic({
          moduleName: moduleInfo.relativeName,
          atomClass: __atomClassRole,
          item,
        });
        if (atomKey && roleScope._roleRightsRead) {
          // role rights read
          const roleName = roleScope._roleRightsRead;
          const scopeNames = [atomKey.itemId];
          const roleRights = [{ roleName, action: 'read', scopeNames }];
          await ctx.bean.role.addRoleRightBatch({
            module: 'a-base',
            atomClassName: 'role',
            roleRights,
          });
        }
      }
      // setDirty
      await ctx.bean.role.setDirty(true);
      // add role rights
      const roleRights = [
        // template
        { roleName: 'system', action: 'read', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'write', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'delete', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'clone', scopeNames: 'OpenAuthScope' },
        // { roleName: 'system', action: 'move', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'addChild', scopeNames: 'OpenAuthScope' },
        // { roleName: 'system', action: 'roleUsers', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'includes', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'resourceAuthorizations', scopeNames: 'OpenAuthScope' },
        { roleName: 'system', action: 'atomAuthorizations', scopeNames: 'OpenAuthScope' },
      ];
      await ctx.bean.role.addRoleRightBatch({ module: 'a-base', atomClassName: 'role', roleRights });
    }

    async _init_rootCliDevTest() {
      // only for test/local env
      if (ctx.app.meta.isProd || ctx.subdomain) return;
      // userRoot
      const userRoot = await ctx.bean.user.get({ userName: 'root' });
      // create
      const authOpenKey = await this._init_rootCliDevTest_create({ userRoot });
      // persistence
      await this._init_rootCliDevTest_persistence({ authOpenKey, userRoot });
    }

    async _init_rootCliDevTest_create({ userRoot }) {
      // create aAuthOpen record for user:root
      const authOpenKey = await ctx.bean.atom.create({
        atomClass: __atomClassAuthOpen,
        user: userRoot,
      });
      // write
      const scopeRole = await ctx.bean.role.parseRoleName({ roleName: 'RoleScopeCliDevelopment' });
      const item = {
        atomName: 'Cli For Development',
        scopeRoleId: scopeRole.id,
        neverExpire: 1,
        expireTime: null,
      };
      await ctx.bean.atom.write({
        key: authOpenKey,
        item,
        user: userRoot,
      });
      // submit
      await ctx.bean.atom.submit({
        key: authOpenKey,
        options: { ignoreFlow: true },
        user: userRoot,
      });
      // hidden
      await this.modelAuthOpen.update({
        id: authOpenKey.itemId,
        userId: userRoot.id,
        clientSecretHidden: 1,
      });
      // ok
      return authOpenKey;
    }

    async _init_rootCliDevTest_persistence({ authOpenKey, userRoot }) {
      // authOpen
      const item = await this.modelAuthOpen.get({ id: authOpenKey.itemId });
      // name
      const name = `clidev@${ctx.app.name}`;
      // host
      const buildConfig = require3(path.join(process.cwd(), 'build/config.js'));
      const host = `http://localhost:${buildConfig.backend.port}`;
      // add
      await this.localToken.add({
        name,
        host,
        clientID: item.clientID,
        clientSecret: item.clientSecret,
        log: true,
      });
      // hideClientSecret
      await ctx.bean.authOpen.hideClientSecret({ itemId: item.id, user: userRoot });
    }
  }
  return VersionInit;
};
