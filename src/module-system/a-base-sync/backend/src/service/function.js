module.exports = app => {

  class Function extends app.Service {

    async list({ options, user }) {
      return await this.ctx.bean.function.list({ options, user });
    }

    async star({ id, star, user }) {
      return await this.ctx.bean.function.star({ id, star, user });
    }

    async check({ functions, user }) {
      return await this.ctx.bean.function.check({ functions, user });
    }

    async scenes({ sceneMenu }) {
      return await this.ctx.bean.function.scenes({ sceneMenu });
    }

  }

  return Function;
};
