module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      await super.create({ atomClass, item, options, user });
      // add roleRight
      const res = await this.ctx.model.roleRight.insert();
      // return key
      const itemId = res.insertId;
      return { atomId: itemId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item, options);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item, options);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update roleRight
      const data = await this.ctx.model.roleRight.prepareData(item);
      await this.ctx.model.roleRight.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete roleRight
      await this.ctx.model.roleRight.delete({
        id: key.itemId,
      });
    }

    _getMeta(/* item, options*/) {
      // layout: list/table/mobile/pc
      // const layout = options && options.layout;
      // meta
      // const meta = this._ensureItemMeta(item);
    }
  }

  return Atom;
};
