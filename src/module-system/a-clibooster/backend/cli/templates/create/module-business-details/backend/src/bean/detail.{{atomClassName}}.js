module.exports = app => {
  class Detail extends app.meta.DetailBase {
    async create({ atomKey, detailClass, item, user }) {
      // super
      const key = await super.create({ atomKey, detailClass, item, user });
      // add {{atomClassName}} detail
      const res = await this.ctx.model.{{atomClassName}}Detail.insert({
        atomId: atomKey.atomId,
        detailId: key.detailId,
      });
      // return key
      return { detailId: key.detailId, detailItemId: res.insertId };
    }

    async read({ detailClass, options, key, user }) {
      // super
      const item = await super.read({ detailClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomKey, detailClass, options, items, user }) {
      // super
      await super.select({ atomKey, detailClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ detailClass, target, key, item, options, user }) {
      // super
      await super.write({ detailClass, target, key, item, options, user });
      // update {{atomClassName}} detail
      const data = await this.ctx.model.{{atomClassName}}Detail.prepareData(item);
      data.id = key.detailItemId;
      // update
      await this.ctx.model.{{atomClassName}}Detail.update(data);
    }

    async delete({ detailClass, target, key, user }) {
      // super
      await super.delete({ detailClass, target, key, user });
      // delete {{atomClassName}} detail
      await this.ctx.model.{{atomClassName}}Detail.delete({
        id: key.detailItemId,
      });
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Detail;
};
