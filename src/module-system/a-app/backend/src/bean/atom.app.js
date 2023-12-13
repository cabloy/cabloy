module.exports = ctx => {
  const moduleInfo = module.info;
  class Atom extends ctx.app.meta.AtomBase {
    constructor() {
      super(ctx);
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).app;
    }

    get modelAppContent() {
      return ctx.model.module(moduleInfo.relativeName).appContent;
    }

    async default({ atomClass, item, options, user }) {
      // app default
      const data = await this.model.default();
      data.content = '{}';
      // super
      return await super.default({ atomClass, data, item, options, user });
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

    async create({ atomClass, item, options, user }) {
      // super
      const data = await super.create({ atomClass, item, options, user });
      // add app
      data.itemId = await this.model.create(data);
      // add content
      if (!data.content) {
        data.content = '{}';
      }
      await this.modelAppContent.create(data);
      // data
      return data;
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      ctx.bean.util.checkDemoForAtomWrite();
      // super
      const data = await super.write({ atomClass, target, key, item, options, user });
      // update app
      if (key.atomId !== 0) {
        await this.model.write(data);
        // update content
        if (data.content !== undefined) {
          await this.modelAppContent.update(
            {
              content: data.content,
            },
            {
              where: {
                atomId: key.atomId,
              },
            }
          );
        }
      }
      // data
      return data;
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete app
      await this.model.delete({
        id: key.itemId,
      });
      // delete content
      await this.modelAppContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item) {
      // locale of atomCategoryName
      item.atomCategoryNameLocale = ctx.text(item.atomCategoryName);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = ctx.text(item.description);
    }
  }

  return Atom;
};
