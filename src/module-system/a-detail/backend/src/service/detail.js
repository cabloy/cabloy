module.exports = app => {

  class Detail extends app.Service {

    async create({ atomKey, detailClass, item, user }) {
      return await this.ctx.bean.detail.create({ atomKey, detailClass, item, user });
    }

    async read({ key, options, user }) {
      return await this.ctx.bean.detail.read({ key, options, user });
    }

    async select({ atomKey, detailClass, options, user }) {
      return await this.ctx.bean.detail.select({ atomKey, detailClass, options, user });
    }

    async count({ atomKey, options, user }) {
      return await this.ctx.bean.detail.count({ atomKey, options, user });
    }

    async write({ key, item, options, user }) {
      return await this.ctx.bean.detail.write({ key, item, options, user });
    }

    async delete({ key, user }) {
      return await this.ctx.bean.detail.delete({ key, user });
    }

  }

  return Detail;
};
