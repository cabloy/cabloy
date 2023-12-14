const moduleInfo = module.info;
module.exports = class Atom extends module.meta.class.AtomBase {
  get model() {
    return this.ctx.model.module(moduleInfo.relativeName).dashboard;
  }

  get modelDashboardContent() {
    return this.ctx.model.module(moduleInfo.relativeName).dashboardContent;
  }

  createContentDefault() {
    return {
      root: {
        id: this.ctx.bean.util.uuidv4(),
        widgets: [],
      },
    };
  }

  async default({ atomClass, item, options, user }) {
    // dashboard default
    const data = await this.model.default();
    data.content = JSON.stringify(this.createContentDefault());
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
    // add dashboard
    data.itemId = await this.model.create(data);
    // add content
    if (!data.content) {
      data.content = JSON.stringify(this.createContentDefault());
    }
    // add content
    await this.modelDashboardContent.create(data);
    // data
    return data;
  }

  async write({ atomClass, target, key, item, options, user }) {
    // check demo
    this.ctx.bean.util.checkDemoForAtomWrite();
    // super
    const data = await super.write({ atomClass, target, key, item, options, user });
    // update dashboard
    if (key.atomId !== 0) {
      await this.model.write(data);
      // update content
      if (data.content !== undefined) {
        await this.modelDashboardContent.update(
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
    // delete dashboard
    await this.model.delete({
      id: key.itemId,
    });
    // delete content
    await this.modelDashboardContent.delete({
      itemId: key.itemId,
    });
  }

  _getMeta(item) {
    const meta = this._ensureItemMeta(item);
    // meta.flags
    // meta.summary
    meta.summary = item.description;
  }
};
