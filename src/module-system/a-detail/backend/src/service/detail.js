module.exports = app => {

  class Detail extends app.Service {

    async create({ detailClass, item, user }) {
      return await this.ctx.bean.detail.create({ detailClass, item, user });
    }

  }

  return Detail;
};
