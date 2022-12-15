/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 581:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */
var Strategy = __webpack_require__(703);


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;


/***/ }),

/***/ 703:
/***/ ((module) => {

/**
 * Creates an instance of `Strategy`.
 *
 * @constructor
 * @api public
 */
function Strategy() {
}

/**
 * Authenticate request.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} req The request to authenticate.
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
Strategy.prototype.authenticate = function(req, options) {
  throw new Error('Strategy#authenticate must be overridden by subclass');
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;


/***/ }),

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 957:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const randomize = require3('randomatic');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    get modelAuth() {
      return this.ctx.model.module('a-base').auth;
    }

    async create({ atomClass, item, options, user }) {
      // check demo
      const ctxCaller = this.ctx.ctxCaller;
      if (ctxCaller && ctxCaller.path === '/api/a/base/atom/create') {
        this.ctx.bean.util.checkDemo();
      }
      // user
      const userId = user.id;
      // super
      const key = await super.create({ atomClass, item, options, user });
      const atomId = key.atomId;
      // clientID clientSecret
      const clientID = randomize('0a', 20);
      const clientSecret = randomize('0a', 40);
      // add authOpen
      const res = await this.ctx.model.authOpen.insert({
        atomId,
        userId,
        clientID,
        clientSecret,
      });
      const itemId = res.insertId;
      // add aAuth record
      const providerItem = await this.ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
      });
      await this.modelAuth.insert({
        userId,
        providerId: providerItem.id,
        profileId: itemId,
        profile: JSON.stringify({
          authOpenId: itemId,
        }),
      });
      // return key
      return { atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update authOpen
      const data = await this.ctx.model.authOpen.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.authOpen.update(data);
    }

    async delete({ atomClass, key, user }) {
      const itemId = key.itemId;
      // super
      await super.delete({ atomClass, key, user });
      // delete aAuth record
      const providerItem = await this.ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
      });
      // not use userId
      await this.modelAuth.delete({
        providerId: providerItem.id,
        profileId: itemId,
      });
      // delete authOpen
      await this.ctx.model.authOpen.delete({
        id: itemId,
      });
    }

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      // hideClientSecret
      if (![101].includes(action)) return res;
      // authOpen
      const item = await this.ctx.model.authOpen.get({ id: atom.itemId });
      // delete
      if (action === 101) {
        if (item.clientSecretHidden === 1) return null;
      }
      // default
      return res;
    }

    _getMeta(item) {
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
      // clientSecretHidden
      if (item.clientSecretHidden) {
        item.clientSecret = '******';
      }
      // scopeRoleName
      if (!item.scopeRoleId) {
        item.scopeRoleName = 'Not Specified';
      }
      if (item.scopeRoleName) {
        item.scopeRoleNameLocale = this.ctx.text(item.scopeRoleName);
      }
    }
  }

  return Atom;
};


/***/ }),

/***/ 755:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Strategy = __webpack_require__(966);

module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    async getConfigDefault() {
      return null;
    }
    checkConfigValid(/* config*/) {
      return true;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(body) {
      const { clientID, clientSecret } = body.data;
      // verify
      const authOpen = await ctx.bean.authOpen.verify({ clientID, clientSecret });
      // maxAge
      let maxAge;
      if (authOpen.neverExpire) {
        // only one day
        maxAge = 0;
      } else {
        maxAge = authOpen.expireTime - Date.now();
      }
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: authOpen.id,
        maxAge,
        authShouldExists: true,
        profile: {
          authOpenId: authOpen.id,
        },
      };
    }
  }

  return Provider;
};


/***/ }),

/***/ 682:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const randomize = require3('randomatic');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: 'a-base',
    atomClassName: 'role',
  };
  const __atomClassAuthOpen = {
    module: moduleInfo.relativeName,
    atomClassName: 'authOpen',
  };
  class AuthOpen {
    get modelAuthOpen() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
    }
    get modelResourceRole() {
      return ctx.model.module('a-base').resourceRole;
    }
    get localAuthSimple() {
      return ctx.bean.local.module('a-authsimple').simple;
    }

    async hideClientSecret({ atomId, itemId, user }) {
      const item = await this._forceAuthOpen({ atomId, itemId });
      const clientSecret = await this.localAuthSimple.calcPassword({ password: item.clientSecret });
      // use userId for safety
      await this.modelAuthOpen.update({
        id: itemId,
        userId: user.id,
        clientSecret,
        clientSecretHidden: 1,
      });
    }

    async resetClientSecret({ atomId, itemId, user }) {
      itemId = await this._forceAuthOpenId({ atomId, itemId });
      // clientSecret
      const clientSecret = randomize('0a', 40);
      // use userId for safety
      await this.modelAuthOpen.update({
        id: itemId,
        userId: user.id,
        clientSecret,
        clientSecretHidden: 0,
      });
    }

    async verify({ clientID, clientSecret }) {
      // authOpen
      const authOpen = await this.modelAuthOpen.get({ clientID });
      if (!authOpen) return ctx.throw(403);
      // clientSecret
      if (authOpen.clientSecretHidden) {
        const res = await this.localAuthSimple.verifyPassword({
          password: clientSecret,
          hash: authOpen.clientSecret,
        });
        if (!res) return ctx.throw(403);
      } else {
        if (clientSecret !== authOpen.clientSecret) return ctx.throw(403);
      }
      // atomDisabled
      const atom = await ctx.bean.atom.modelAtom.get({ id: authOpen.atomId });
      if (atom.atomDisabled) return ctx.throw(403);
      // neverExpire/expireTime
      if (!authOpen.neverExpire && authOpen.expireTime <= Date.now()) {
        return ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // done
      return authOpen;
    }

    isAuthOpen() {
      const provider = ctx.bean.util.getProperty(ctx, 'state.user.provider');
      if (!provider) return false;
      return provider.module === 'a-authopen' && provider.providerName === 'authopen' ? provider : null;
    }

    async prepareAuthOpen() {
      const provider = this.isAuthOpen();
      if (!provider) return null; // not auth open provider
      const authOpen = await this.getAuthOpenByAuthId({ authId: provider.id });
      // check full
      if (authOpen.scopeRoleName === 'RoleScopeFull') return null;
      // ok
      return authOpen;
    }

    async checkRightResource({ resourceAtomId }) {
      // authOpen
      const authOpen = await this.prepareAuthOpen();
      if (!authOpen) return true;
      // check
      const right = await ctx.model.queryOne(
        `
          select * from aViewRoleRightResource a
            where a.iid=? and a.roleIdWho=? and a.atomId=?
        `,
        [ctx.instance.id, authOpen.scopeRoleId, resourceAtomId]
      );
      return !!right;
    }

    async checkRightAtomAction({ atomClass, action }) {
      // authOpen
      const authOpen = await this.prepareAuthOpen();
      if (!authOpen) return true;
      // parse action code
      action = ctx.bean.atomAction.parseActionCode({
        action,
        atomClass,
      });
      // check
      const right = await ctx.model.queryOne(
        `
        select * from aViewRoleRightAtomClass a
            where a.iid=? and a.roleIdWho=? and a.atomClassId=? and action=?
      `,
        [ctx.instance.id, authOpen.scopeRoleId, atomClass.id, action]
      );
      return !!right;
    }

    async getAuthOpenByAuthId({ authId }) {
      return await ctx.model.queryOne(
        `
          select a.* from aAuthOpenView a
            inner join aAuth b on a.id=b.profileId
              where a.iid=? and a.deleted=0 and b.id=? 
        `,
        [ctx.instance.id, authId]
      );
    }

    async _forceAuthOpenId({ atomId, itemId }) {
      if (!itemId) {
        const item = await this.modelAuthOpen.get({ atomId });
        itemId = item.id;
      }
      return itemId;
    }

    async _forceAuthOpen({ atomId, itemId }) {
      if (!itemId) {
        return await this.modelAuthOpen.get({ atomId });
      }
      return await this.modelAuthOpen.get({ id: itemId });
    }

    // create aAuthOpen record for user
    async createAuthOpen({ item: { atomName, scopeRoleName, neverExpire = 1, expireTime = null }, user }) {
      const authOpenKey = await ctx.bean.atom.create({
        atomClass: __atomClassAuthOpen,
        user,
      });
      // write
      const scopeRole = await ctx.bean.role.parseRoleName({ roleName: scopeRoleName });
      const item = {
        atomName,
        scopeRoleId: scopeRole.id,
        neverExpire,
        expireTime,
      };
      await ctx.bean.atom.write({
        key: authOpenKey,
        item,
        user,
      });
      // submit
      await ctx.bean.atom.submit({
        key: authOpenKey,
        options: { ignoreFlow: true },
        user,
      });
      // ok
      return authOpenKey;
    }

    async createRoleScopes({ roleScopes, setDirty = true }) {
      //
      for (const roleScope of roleScopes) {
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
      if (setDirty) {
        await ctx.bean.role.setDirty(true);
      }
    }
  }
  return AuthOpen;
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    get modelAuthOpen() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
    }
    async execute(context, next) {
      const data = context.data;
      // delete aAuthOpen/aAuth
      const items = await this.modelAuthOpen.select({
        where: { userId: data.userIdFrom },
      });
      for (const item of items) {
        await ctx.bean.atom.delete({ key: { atomId: item.atomId } });
      }
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 904:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const chalk = require3('chalk');
const Table = require3('cli-table3');
const eggBornUtils = require3('egg-born-utils');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    async add({ name, host, clientID, clientSecret, log }) {
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // config
      if (!config.tokens) config.tokens = {};
      config.tokens[name] = {
        host,
        clientID,
        clientSecret,
      };
      // save
      await eggBornUtils.openAuthConfig.save({ config });
      // log
      if (log) {
        console.log(chalk.cyan(`\n  ${fileName}\n`));
      }
      // ok
      return { fileName, config };
    }

    async delete({ name, log }) {
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // config
      if (config.tokens && config.tokens[name]) {
        // delete
        delete config.tokens[name];
        // save
        await eggBornUtils.openAuthConfig.save({ config });
      }
      // log
      if (log) {
        console.log(chalk.cyan(`\n  ${fileName}\n`));
      }
      // ok
      return { fileName, config };
    }

    async get({ name }) {
      // init file
      const { config } = await eggBornUtils.openAuthConfig.load();
      return config.tokens && config.tokens[name];
    }

    async list({ log }) {
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // log
      if (log) {
        // tokens
        if (!config.tokens) config.tokens = {};
        const table = new Table({
          head: ['Token Name', 'Host'],
          colWidths: [30, 50],
        });
        for (const tokenName in config.tokens) {
          const token = config.tokens[tokenName];
          table.push([tokenName, token.host]);
        }
        console.log(table.toString());
        // fileName
        console.log(chalk.cyan(`\n  ${fileName}\n`));
      }
      // ok
      return { fileName, config };
    }
  }
  return Local;
};


/***/ }),

/***/ 899:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const VersionUpdate1Fn = __webpack_require__(39);
const VersionInit1Fn = __webpack_require__(519);

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }
    }

    async init(options) {
      if (options.version === 1) {
        const versionInit1 = new (VersionInit1Fn(this.ctx))();
        await versionInit1.run(options);
      }
    }

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(17);
const require3 = __webpack_require__(638);
const initData = __webpack_require__(358);

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
      const buildConfig = require3(path.join(process.cwd(), 'build/config.js'));
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


/***/ }),

/***/ 358:
/***/ ((module) => {

// roleScopes
const roleScopes = [
  {
    atomName: 'OpenAuthScope',
    atomStaticKey: 'roleOpenAuthScope',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 0,
    roleTypeCode: 6,
    roleIdParent: 0, // 'authenticated',
    _roleRightsRead: null,
  },
  {
    atomName: 'RoleScopeFull',
    atomStaticKey: 'roleScopeFull',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 0,
    roleTypeCode: 6,
    roleIdParent: 'OpenAuthScope',
    _roleRightsRead: 'authenticated',
  },
  {
    atomName: 'RoleScopeCliDevelopment',
    atomStaticKey: 'roleScopeCliDevelopment',
    atomRevision: 0,
    description: '',
    system: 1,
    sorting: 1,
    roleTypeCode: 6,
    roleIdParent: 'OpenAuthScope',
    _roleRightsRead: null,
  },
];

module.exports = {
  roleScopes,
};


/***/ }),

/***/ 39:
/***/ ((module) => {

module.exports = function (ctx) {
  class VersionUpdate {
    async run() {
      // create table: aAuthOpen
      let sql = `
      CREATE TABLE aAuthOpen (
        id int(11) NOT NULL AUTO_INCREMENT,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted int(11) DEFAULT '0',
        iid int(11) DEFAULT '0',
        atomId int(11) DEFAULT '0',
        description varchar(255) DEFAULT NULL,
        userId int(11) DEFAULT '0',
        scopeRoleId int(11) DEFAULT '0',
        neverExpire int(11) DEFAULT '1',
        expireTime timestamp DEFAULT NULL,
        clientID varchar(50) DEFAULT NULL,
        clientSecret text DEFAULT NULL,
        clientSecretHidden int(11) DEFAULT '0',
        PRIMARY KEY (id)
      )
    `;
      await ctx.model.query(sql);
      // view: aAuthOpenView
      sql = `
          CREATE VIEW aAuthOpenView as
            select a.*,b.roleName as scopeRoleName from aAuthOpen a
              left join aRole b on a.scopeRoleId=b.id
        `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const eventAccountMigration = __webpack_require__(836);
const atomAuthOpen = __webpack_require__(957);
const authProviderOpen = __webpack_require__(755);
const localToken = __webpack_require__(904);
const beanAuthOpen = __webpack_require__(682);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
    // atom
    'atom.authOpen': {
      mode: 'app',
      bean: atomAuthOpen,
    },
    // auth.provider
    'auth.provider.open': {
      mode: 'ctx',
      bean: authProviderOpen,
    },
    // local
    'local.token': {
      mode: 'ctx',
      bean: localToken,
    },
    // global
    authOpen: {
      mode: 'ctx',
      bean: beanAuthOpen,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'AuthOpenTokenExpired',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  RoleScopeFull: 'Full',
  RoleScopeCliDevelopment: 'Cli For Development',
  AuthOpenTokenExpired: 'Token Expired',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Open Auth': '开放认证',
  'Create AuthOpen': '新建AuthOpen',
  'AuthOpen List': 'AuthOpen列表',
  'Not Specified': '未指定',
  'Hide Client Secret': '隐藏Client Secret',
  'Reset Client Secret': '重置Client Secret',
  RoleScopeFull: '全部',
  RoleScopeCliDevelopment: '开发Cli',
  AuthOpenTokenExpired: '令牌已过期',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 443:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  function _createProvider() {
    return {
      meta: {
        title: 'Open Auth',
        mode: 'direct',
        scene: false,
        inner: true,
        bean: 'open',
        render: null,
        validator: null,
        icon: { f7: ':role:shield-key' },
      },
    };
  }

  const metaAuth = {
    providers: {
      authopen: _createProvider(),
    },
  };

  // ok
  return metaAuth;
};


/***/ }),

/***/ 966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const passport = __webpack_require__(581);
const util = __webpack_require__(837);

function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('LocalStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'authopen';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function (req) {
  // self
  const self = this;
  const ctx = req.ctx;

  // check
  if (req.method === 'GET') {
    // not allow
    return self.error(ctx.parseFail(403));
  }

  // verified
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    ctx.success(user);
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, req.body, verified);
    } else {
      this._verify(req.body, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

module.exports = Strategy;


/***/ }),

/***/ 120:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                },
              },
              {
                dataIndex: 'description',
                title: 'Description',
                align: 'left',
              },
              {
                dataIndex: 'userName',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellUserName',
                },
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'left',
              },
              {
                dataIndex: 'atomUpdatedAt',
                title: 'Modification Time',
                align: 'left',
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Open Auth',
    atomStaticKey: 'layoutAtomListAuthOpen',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutAtomListAuthOpen = __webpack_require__(120);

module.exports = app => {
  const layouts = [layoutAtomListAuthOpen(app)];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    // {
    //   atomName: 'Create AuthOpen',
    //   atomStaticKey: 'createAuthOpen',
    //   atomRevision: 0,
    //   atomCategoryId: 'a-base:menu.Create',
    //   resourceType: 'a-base:menu',
    //   resourceConfig: JSON.stringify({
    //     module: moduleInfo.relativeName,
    //     atomClassName: 'authOpen',
    //     atomAction: 'create',
    //   }),
    //   resourceRoles: 'template.system',
    // },
    // {
    //   atomName: 'AuthOpen List',
    //   atomStaticKey: 'listAuthOpen',
    //   atomRevision: 0,
    //   atomCategoryId: 'a-base:menu.List',
    //   resourceType: 'a-base:menu',
    //   resourceConfig: JSON.stringify({
    //     module: moduleInfo.relativeName,
    //     atomClassName: 'authOpen',
    //     atomAction: 'read',
    //   }),
    //   resourceRoles: 'template.system',
    // },
  ];
  return resources;
};


/***/ }),

/***/ 815:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // authOpen
  schemas.authOpen = {
    type: 'object',
    properties: {
      // title
      __groupTitle: {
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      scopeRoleId: {
        type: 'number',
        ebType: 'role',
        ebTitle: 'AuthorizationScopeTitle',
        ebParams: {
          titleAlias: 'Scope',
          roleIdStart: null,
          multiple: false,
          catalogOnly: false,
          leafOnly: true,
          roleTypes: [6],
          mapper: {
            scopeRoleId: 'itemId',
            scopeRoleName: 'atomName',
            scopeRoleNameLocale: 'atomNameLocale',
          },
        },
        notEmpty: true,
      },
      neverExpire: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'NeverExpire',
      },
      expireTime: {
        type: ['object', 'null'],
        ebType: 'datePicker',
        ebTitle: 'Expiration Time',
        ebParams: {
          timePicker: true,
          dateFormat: 'YYYY-MM-DD HH:mm:00',
          header: false,
          toolbar: true,
        },
        ebDisplay: {
          expression: '!neverExpire',
          dependencies: ['neverExpire'],
        },
        notEmpty: {
          expression: '!neverExpire',
        },
      },
      // Auth Info
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Auth Info',
      },
      clientID: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Client ID',
        ebReadOnly: true,
      },
      clientSecret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Client Secret',
        ebReadOnly: true,
      },
    },
  };
  // authOpen search
  schemas.authOpenSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authOpen = __webpack_require__(815);

module.exports = app => {
  const schemas = {};
  // authOpen
  Object.assign(schemas, authOpen(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 523:
/***/ ((module) => {

module.exports = app => {
  class AuthController extends app.Controller {
    async signin() {
      // check demo
      this.ctx.bean.util.checkDemo();
      // data: { clientID, clientSecret }
      const res = await this.ctx.service.auth.signin({
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};


/***/ }),

/***/ 725:
/***/ ((module) => {

module.exports = app => {
  class AuthOpenController extends app.Controller {
    async hideClientSecret() {
      // check demo
      // this.ctx.bean.util.checkDemo();
      const res = await this.ctx.service.authOpen.hideClientSecret({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async resetClientSecret() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.ctx.service.authOpen.resetClientSecret({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return AuthOpenController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const auth = __webpack_require__(523);
const authOpen = __webpack_require__(725);

module.exports = app => {
  const controllers = {
    auth,
    authOpen,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {
  // aops
  const aops = __webpack_require__(224)(app);
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    aops,
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authFn = __webpack_require__(443);

// actionPathListOpenAuthSelf
const _options = {
  stage: 'formal',
  mine: 1,
};
const actionPathListOpenAuthSelf = `/a/basefront/atom/list?module=a-authopen&atomClassName=authOpen&options=${encodeURIComponent(
  JSON.stringify(_options)
)}`;

module.exports = app => {
  // schemas
  const schemas = __webpack_require__(232)(app);
  // static
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    auth: authFn,
    base: {
      atoms: {
        authOpen: {
          info: {
            bean: 'authOpen',
            title: 'Open Auth',
            tableName: 'aAuthOpen',
            tableNameModes: {
              default: 'aAuthOpenView',
            },
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
            fields: {
              custom: ['clientID,clientSecret,clientSecretHidden'],
            },
            layout: {
              config: {
                atomList: 'layoutAtomListAuthOpen',
              },
            },
          },
          actions: {
            hideClientSecret: {
              code: 101,
              title: 'Hide Client Secret',
              actionModule: 'a-authopen',
              actionComponent: 'action',
              icon: { f7: ':outline:visibility-off-outline' },
            },
            resetClientSecret: {
              code: 102,
              title: 'Reset Client Secret',
              actionModule: 'a-authopen',
              actionComponent: 'action',
              icon: { f7: ':outline:key-reset-outline' },
            },
          },
          validator: 'authOpen',
          search: {
            validator: 'authOpenSearch',
          },
        },
      },
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        authOpen: {
          schemas: 'authOpen',
        },
        authOpenSearch: {
          schemas: 'authOpenSearch',
        },
      },
      keywords: {},
      schemas,
    },
    settings: {
      user: {
        actionPath: actionPathListOpenAuthSelf,
      },
    },
    event: {
      implementations: {
        'a-base:accountMigration': 'accountMigration',
      },
    },
    index: {
      indexes: {
        aAuthOpen: 'createdAt,updatedAt,atomId,userId,scopeRoleId',
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 506:
/***/ ((module) => {

module.exports = app => {
  class AuthOpen extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuthOpen', options: { disableDeleted: false } });
    }
  }
  return AuthOpen;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authOpen = __webpack_require__(506);

module.exports = app => {
  const models = {
    authOpen,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // authOpen
    {
      method: 'post',
      path: 'authOpen/hideClientSecret',
      controller: 'authOpen',
      meta: { right: { type: 'atom', atomClass: 'a-authopen:authOpen', action: 'hideClientSecret' } },
    },
    {
      method: 'post',
      path: 'authOpen/resetClientSecret',
      controller: 'authOpen',
      meta: { right: { type: 'atom', atomClass: 'a-authopen:authOpen', action: 'resetClientSecret' } },
    },
    // auth
    {
      method: 'post',
      path: 'auth/signin',
      controller: 'auth',
      meta: { auth: { enable: false } },
    },
  ];
  return routes;
};


/***/ }),

/***/ 300:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    // data: { clientID, clientSecret }
    async signin({ data, state = 'login' }) {
      // signin
      await this.ctx.bean.authProvider.authenticateDirect({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
        query: { state },
        body: { data },
      });
      // user info
      return await this.ctx.bean.auth.getLoginInfo({ clientId: true });
    }
  }

  return Auth;
};


/***/ }),

/***/ 691:
/***/ ((module) => {

module.exports = app => {
  class AuthOpen extends app.Service {
    async hideClientSecret({ key, user }) {
      return await this.ctx.bean.authOpen.hideClientSecret({
        atomId: key.atomId,
        itemId: key.itemId,
        user,
      });
    }

    async resetClientSecret({ key, user }) {
      return await this.ctx.bean.authOpen.resetClientSecret({
        atomId: key.atomId,
        itemId: key.itemId,
        user,
      });
    }
  }

  return AuthOpen;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const auth = __webpack_require__(300);
const authOpen = __webpack_require__(691);

module.exports = app => {
  const services = {
    auth,
    authOpen,
  };
  return services;
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map