module.exports = app => {

  class Detail extends app.meta.DetailBase {

    async create({ atomKey, detailClass, item, user }) {
      // super
      const key = await super.create({ atomKey, detailClass, item, user });
      // add purchaseOrder detail
      const res = await this.ctx.model.purchaseOrderDetail.insert({
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
      // update purchaseOrder detail
      const data = await this.ctx.model.purchaseOrderDetail.prepareData(item);
      data.id = key.detailItemId;
      // update
      await this.ctx.model.purchaseOrderDetail.update(data);
    }

    async delete({ detailClass, target, key, user }) {
      // delete purchaseOrder detail
      await this.ctx.model.purchaseOrderDetail.delete({
        id: key.detailItemId,
      });
      // super
      await super.delete({ detailClass, target, key, user });
    }

    _getMeta(item) {
      // flags
      const flags = [];
      if (item.quantity > 1) {
        flags.push(item.quantity);
      }
      const amount = (item.amount / 100).toFixed(2);
      flags.push(amount);
      // meta
      const meta = {
        summary: item.detailCode,
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Detail;
};
