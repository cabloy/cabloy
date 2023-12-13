module.exports = ctx => {
  const moduleInfo = module.info;
  class Atom extends ctx.app.meta.AtomBase {
    constructor() {
      super(ctx);
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).userOnline;
    }

    async default({ atomClass, item, options, user }) {
      // userOnline default
      const data = await this.model.default();
      // super
      return await super.default({ atomClass, data, item, options, user });
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      await this._getMeta(item, options);
      // ok
      return item;
    }

    async selectQuery({ atomClass, options, user }) {
      // orders
      for (const order of options.orders) {
        if (order[0] === 'f.onlineStatus') {
          order[0] = 'f.expireTime';
        }
      }
      // where
      for (const key of Object.keys(options.where)) {
        if (key === 'f.onlineStatus') {
          let clause = options.where[key];
          if (clause.val === 1) {
            // offline
            clause = { op: '<=', val: new Date() };
          } else {
            // online
            clause = { op: '>', val: new Date() };
          }
          delete options.where['f.onlineStatus'];
          options.where['f.expireTime'] = clause;
        }
      }
      // super
      return await super.selectQuery({ atomClass, options, user });
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        await this._getMeta(item, options);
      }
    }

    async create({ atomClass, item, options, user }) {
      // super
      const data = await super.create({ atomClass, item, options, user });
      // add userOnline
      if (!data.userId) {
        data.userId = item.userId;
      }
      data.itemId = await this.model.create(data);
      // data
      return data;
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      const data = await super.write({ atomClass, target, key, item, options, user });
      // update userOnline
      if (key.atomId !== 0) {
        await this.model.write(data);
      }
      // data
      return data;
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete userOnline
      await this.model.delete({
        id: key.itemId,
      });
    }

    async checkRightAction({ atom, atomClass, action, options, user }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, options, user });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      if (action !== 101) return res;
      // kickOut
      const item = await this.model.get({ id: atom.itemId });
      if (action === 101 && this._getOnlineStatus(item) === 2) return res;
      return null;
    }

    async performAction({ key, atomClass, action, item, options, user }) {
      // super
      await super.performAction({ key, atomClass, action, item, options, user });
      // kickOut
      if (action === 'kickOut') {
        const item = await this.model.get({ id: key.itemId });
        const user = { id: item.userId };
        await ctx.bean.userOnline.kickOut({ user });
      }
    }

    _getOnlineStatus(item) {
      return item.expireTime <= new Date() ? 1 : 2;
    }

    async _translate(item) {
      item.onlineStatus = this._getOnlineStatus(item);
      const dictItem = await ctx.bean.dict.findItem({
        dictKey: 'a-dictbooster:dictOnlineStatus',
        code: item.onlineStatus,
      });
      item._onlineStatusTitle = dictItem.titleFull;
      item._onlineStatusTitleLocale = dictItem.titleLocaleFull;
    }

    async _getMeta(item, options) {
      // layout: list/table/mobile/pc
      const layout = options && options.layout;
      // online status
      await this._translate(item);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (layout !== 'table' && item.onlineStatus === 2) {
        meta.flags.push(item._onlineStatusTitleLocale);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
