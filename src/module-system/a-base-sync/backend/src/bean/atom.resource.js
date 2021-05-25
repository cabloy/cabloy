module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
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
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update resource
      const data = await this.ctx.model.resource.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.resource.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete resource
      await this.ctx.model.resource.delete({
        id: key.itemId,
      });
      // delete resource locales
      await this.ctx.model.resourceLocale.delete({
        atomId: key.atomId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    _getMeta(options, item, showSorting) {
      // resourceTypes
      const resourceTypes = this.ctx.bean.base.resourceTypes();
      const resourceType = resourceTypes[item.resourceType];
      // locale of atomCategoryName
      item.atomCategoryNameLocale = this.ctx.text(item.atomCategoryName);
      // flags
      const flags = [];
      if (showSorting) {
        flags.push(item.resourceSorting);
      }
      // layout
      const layout = options && options.layout;
      if (layout === 'list') {
        // type/categary
        if (resourceType) {
          const typeCategory = `${resourceType.titleLocale} / ${item.atomCategoryNameLocale}`;
          flags.push(typeCategory);
        }
      } else if (layout === 'table') {
        if (resourceType) {
          item.resourceTypeLocale = this.ctx.text(resourceType.titleLocale);
        }
      }
      // meta
      const meta = {
        summary: item.description,
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Atom;
};
