module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add app
      const res = await this.ctx.model.app.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      const content = {};
      await this.ctx.model.appContent.insert({
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
      // check demo
      this.ctx.bean.util.checkDemoForAtomWrite();
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update app
      const data = await this.ctx.model.app.prepareData(item);
      await this.ctx.model.app.update(data);
      // update content
      await this.ctx.model.appContent.update(
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
      // delete app
      await this.ctx.model.app.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.appContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item) {
      // locale of atomCategoryName
      item.atomCategoryNameLocale = this.ctx.text(item.atomCategoryName);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = this.ctx.text(item.description);
    }
  }

  return Atom;
};
