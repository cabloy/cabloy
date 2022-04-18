const path = require('path');
const require3 = require('require3');
const chalk = require3('chalk');
const eggBornUtils = require3('egg-born-utils');
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
      if (ctx.app.meta.isProd) return;
      // create
      const authOpenKey = await this._init_rootCliDevTest_create();
      // persistence
      await this._init_rootCliDevTest_persistence({ authOpenKey });
    }

    async _init_rootCliDevTest_create() {
      // create aAuthOpen record for user:root
      const userRoot = await ctx.bean.user.get({ userName: 'root' });
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

    async _init_rootCliDevTest_persistence({ authOpenKey }) {
      // authOpen
      const item = await this.modelAuthOpen.get({ id: authOpenKey.itemId });
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // chalk
      console.log(chalk.cyan(`\n  ${fileName}\n`));
      // backend port
      const buildConfig = require3(path.join(process.cwd(), 'build/config.js'));
      const port = buildConfig.backend.port;
      // token name
      const tokenName = `clidev@${ctx.app.name}`;
      // config
      if (!config.tokens) config.tokens = {};
      config.tokens[tokenName] = {
        host: `http://localhost:${port}`,
        clientID: item.clientID,
        clientSecret: item.clientSecret,
      };
      // save
      await eggBornUtils.openAuthConfig.save({ config });
    }
  }
  return VersionInit;
};
