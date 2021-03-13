module.exports = app => {

  class Detail extends app.meta.DetailBase {

    async create({ atomKey, detailClass, item, user }) {
      // super
      const key = await super.create({ atomKey, detailClass, item, user });
      // add detail
      const res = await this.ctx.model.purchaseOrderDetail.insert({
        atomId: atomKey.atomId,
        detailId: key.detailId,
      });
      // return key
      return { detailId: key.detailId, detailItemId: res.insertId };
    }

  }

  return Detail;
};
