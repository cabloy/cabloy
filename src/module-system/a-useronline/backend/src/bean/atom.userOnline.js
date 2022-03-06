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
      await this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      console.log(options);
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        await this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update userOnline
      const data = await this.ctx.model.userOnline.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.userOnline.update(data);
    }

    async delete({ atomClass, key, user }) {
      // super
      await super.delete({ atomClass, key, user });
      // delete userOnline
      await this.ctx.model.userOnline.delete({
        id: key.itemId,
      });
    }

    async _translate(item) {
      item.onlineStatus = item.expireTime <= new Date() ? 1 : 2;
      const dictItem = await this.ctx.bean.dict.findItem({
        dictKey: 'a-dictbooster:dictOnlineStatus',
        code: item.onlineStatus,
      });
      item._onlineStatusTitle = dictItem.titleFull;
      item._onlineStatusTitleLocale = dictItem.titleLocaleFull;
    }

    async _getMeta(item) {
      // online status
      await this._translate(item);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
