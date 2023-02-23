module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add resource
      const res = await this.ctx.model.resource.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      return { atomId: key.atomId, itemId };
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
      // check demo
      this.ctx.bean.util.checkDemoForAtomWrite();
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update resource
      const data = await this.ctx.model.resource.prepareData(item);
      await this.ctx.model.resource.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete resource
      await this.ctx.model.resource.delete({
        id: key.itemId,
      });
      // delete resource locales
      await this.ctx.model.resourceLocale.delete({
        atomId: key.atomId,
      });
    }

    _getMeta(options, item, showSorting) {
      // resourceTypes
      const resourceTypes = this.ctx.bean.base.resourceTypes();
      const resourceType = resourceTypes[item.resourceType];
      if (resourceType) {
        item.resourceTypeLocale = resourceType.titleLocale;
      }
      // locale of appName
      if (item.appName) {
        item.appNameLocale = this.ctx.text(item.appName);
      }
      // locale of atomCategoryName
      item.atomCategoryNameLocale = this.ctx.text(item.atomCategoryName);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (showSorting) {
        meta.flags.push(item.resourceSorting);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
