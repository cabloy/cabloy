const path = require('path');

const initData = require('./initData1.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
      // createRoleScopes
      await ctx.bean.authOpen.createRoleScopes({ roleScopes: initData.roleScopes, setDirty: true });
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
      const item = {
        atomName: 'Cli For Development',
        scopeRoleName: 'RoleScopeCliDevelopment',
        neverExpire: 1,
        expireTime: null,
      };
      return await ctx.bean.authOpen.createAuthOpen({ item, user: userRoot });
    }

    async _init_rootCliDevTest_persistence({ authOpenKey, userRoot }) {
      // authOpen
      const item = await this.modelAuthOpen.get({ id: authOpenKey.itemId });
      // name
      const name = `clidev@${ctx.app.name}`;
      // host
      const buildConfig = ctx.app.meta.util.requireDynamic(path.join(process.cwd(), 'build/config.js'));
      const host = `http://127.0.0.1:${buildConfig.backend.port}`;
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
