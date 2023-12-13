const randomize = require('randomatic');

module.exports = ctx => {
  const moduleInfo = module.info;
  class Atom extends ctx.app.meta.AtomBase {
    constructor() {
      super(ctx);
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
    }

    get modelAuth() {
      return ctx.model.module('a-base').auth;
    }

    async default({ atomClass, item, options, user }) {
      // authOpen default
      const data = await this.model.default();
      // super
      return await super.default({ atomClass, data, item, options, user });
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

    async create({ atomClass, item, options, user }) {
      // check demo
      ctx.bean.util.checkDemoForAtomCreate();
      // super
      const data = await super.create({ atomClass, item, options, user });
      // user
      if (!data.userId) {
        data.userId = user.id;
      }
      // clientID clientSecret
      if (!data.clientID) {
        data.clientID = randomize('0a', 20);
        data.clientSecret = randomize('0a', 40);
      }
      // add authOpen
      data.itemId = await this.model.create(data);
      const itemId = data.itemId;
      // add aAuth record
      const providerItem = await ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
      });
      await this.modelAuth.insert({
        userId: data.userId,
        providerId: providerItem.id,
        profileId: itemId,
        profile: JSON.stringify({
          authOpenId: itemId,
        }),
      });
      // data
      return data;
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      const data = await super.write({ atomClass, target, key, item, options, user });
      // update authOpen
      if (key.atomId !== 0) {
        await this.model.write(data);
      }
      // data
      return data;
    }

    async delete({ atomClass, key, user }) {
      const itemId = key.itemId;
      // super
      await super.delete({ atomClass, key, user });
      // delete aAuth record
      const providerItem = await ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authopen',
      });
      // not use userId
      await this.modelAuth.delete({
        providerId: providerItem.id,
        profileId: itemId,
      });
      // delete authOpen
      await this.model.delete({
        id: itemId,
      });
    }

    async checkRightAction({ atom, atomClass, action, options, user }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, options, user });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      // hideClientSecret
      if (![101].includes(action)) return res;
      // authOpen
      const item = await this.model.get({ id: atom.itemId });
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
        item.scopeRoleNameLocale = ctx.text(item.scopeRoleName);
      }
    }
  }

  return Atom;
};
