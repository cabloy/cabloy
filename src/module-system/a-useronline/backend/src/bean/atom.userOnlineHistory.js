module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends ctx.app.meta.AtomBase {
    constructor() {
      super(ctx);
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).userOnlineHistory;
    }

    async create({ atomClass, item, options, user }) {
      // super
      await super.create({ atomClass, item, options, user });
      // add userOnlineHistory
      const res = await this.model.insert();
      // return key
      const itemId = res.insertId;
      return { atomId: itemId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // check demo
      ctx.bean.util.checkDemoForAtomRead();
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item, options);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // check demo
      ctx.bean.util.checkDemoForAtomSelect();
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item, options);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      const data = await super.write({ atomClass, target, key, item, options, user });
      // update userOnlineHistory
      if (key.atomId !== 0) {
        const data2 = await this.model.prepareData(data);
        await this.model.update(data2);
      }
      // data
      return data;
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete userOnlineHistory
      await this.model.delete({
        id: key.itemId,
      });
    }

    _getMeta(item, options) {
      // layout: list/table/mobile/pc
      const layout = options && options.layout;
      // meta
      const meta = this._ensureItemMeta(item);
      // media
      meta.media = item._userIdAvatar;
      meta.atomName = item._userIdName;
      if (layout === 'list') {
        // meta.flags
        meta.flags.push(item.onlineIP);
        meta.flags.push(item._isLoginTitleLocale);
        // meta.summary
        // meta.summary = item.onlineIP;
      }
    }
  }

  return Atom;
};
