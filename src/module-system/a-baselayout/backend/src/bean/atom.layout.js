module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add layout
      const res = await this.ctx.model.layout.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      const content = {};
      await this.ctx.model.layoutContent.insert({
        atomId: key.atomId,
        itemId,
        content: JSON.stringify(content),
      });
      return { atomId: key.atomId, itemId };
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
      // update layout
      const data = await this.ctx.model.layout.prepareData(item);
      await this.ctx.model.layout.update(data);
      // update content
      await this.ctx.model.layoutContent.update(
        {
          content: item.content,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete layout
      await this.ctx.model.layout.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.layoutContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item, options) {
      // layout: list/table/mobile/pc
      const layout = options && options.layout;
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (layout !== 'table') {
        meta.flags.push(item._layoutTypeCodeTitleLocale);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
