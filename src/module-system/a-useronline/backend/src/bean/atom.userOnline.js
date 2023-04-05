module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add userOnline
      const res = await this.ctx.model.userOnline.insert({
        atomId: key.atomId,
        userId: item.userId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
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

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update userOnline
      const data = await this.ctx.model.userOnline.prepareData(item);
      await this.ctx.model.userOnline.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete userOnline
      await this.ctx.model.userOnline.delete({
        id: key.itemId,
      });
    }

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      if (action !== 101) return res;
      // kickOut
      const item = await this.ctx.model.userOnline.get({ id: atom.itemId });
      if (action === 101 && this._getOnlineStatus(item) === 2) return res;
      return null;
    }

    _getOnlineStatus(item) {
      return item.expireTime <= new Date() ? 1 : 2;
    }

    async _translate(item) {
      item.onlineStatus = this._getOnlineStatus(item);
      const dictItem = await this.ctx.bean.dict.findItem({
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
