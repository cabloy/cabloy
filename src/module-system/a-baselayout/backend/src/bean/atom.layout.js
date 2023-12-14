const moduleInfo = module.info;
module.exports = class Atom extends module.meta.class.AtomBase {
  get model() {
    return this.ctx.model.module(moduleInfo.relativeName).layout;
  }

  get modelLayoutContent() {
    return this.ctx.model.module(moduleInfo.relativeName).layoutContent;
  }

  async default({ atomClass, item, options, user }) {
    // layoutContent default
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

  async create({ atomClass, item, options, user }) {
    // super
    const data = await super.create({ atomClass, item, options, user });
    // add layout
    data.itemId = await this.model.create(data);
    // add content
    await this.modelLayoutContent.create(data);
    // data
    return data;
  }

  async write({ atomClass, target, key, item, options, user }) {
    // check demo
    this.ctx.bean.util.checkDemoForAtomWrite();
    // super
    const data = await super.write({ atomClass, target, key, item, options, user });
    // update layout
    if (key.atomId !== 0) {
      await this.model.write(data);
      // update content
      if (data.content !== undefined) {
        await this.modelLayoutContent.update(
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
    // delete layout
    await this.model.delete({
      id: key.itemId,
    });
    // delete content
    await this.modelLayoutContent.delete({
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
};
