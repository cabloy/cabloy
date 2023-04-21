const require3 = require('require3');
const randomize = require3('randomatic');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    get modelAuth() {
      return this.ctx.model.module('a-base').auth;
    }

    async create({ atomClass, item, options, user }) {
      // check demo
      this.ctx.bean.util.checkDemoForAtomCreate();
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
