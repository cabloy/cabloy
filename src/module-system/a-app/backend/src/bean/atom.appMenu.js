module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add appMenu
      const res = await this.ctx.model.appMenu.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(options, item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      const showSorting = !!(options && options.category);
      for (const item of items) {
        this._getMeta(options, item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update appMenu
      const data = await this.ctx.model.appMenu.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.appMenu.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete appMenu
      await this.ctx.model.appMenu.delete({
        id: key.itemId,
      });
    }

    _getMeta(options, item, showSorting) {
      // locale of atomCategoryName
      item.atomCategoryNameLocale = this.ctx.text(item.atomCategoryName);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (showSorting) {
        meta.flags.push(item.appMenuSorting);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
