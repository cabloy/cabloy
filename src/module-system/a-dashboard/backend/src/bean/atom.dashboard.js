module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add dashboard
      const res = await this.ctx.model.dashboard.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      const content = {
        root: {
          id: this.ctx.bean.util.uuidv4(),
          widgets: [],
        },
      };
      await this.ctx.model.dashboardContent.insert({
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
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update dashboard
      const data = await this.ctx.model.dashboard.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.dashboard.update(data);
      // update content
      await this.ctx.model.dashboardContent.update(
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
      // delete dashboard
      await this.ctx.model.dashboard.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.dashboardContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
