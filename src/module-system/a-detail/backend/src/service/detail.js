module.exports = app => {

  class Detail extends app.Service {

    async create({ atomKey, detailClass, item, user }) {
      return await this.ctx.bean.detail.create({ atomKey, detailClass, item, user });
    }

  }

  return Detail;
};
