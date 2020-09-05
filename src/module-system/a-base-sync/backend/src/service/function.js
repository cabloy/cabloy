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

    async register({ module, name }) {
      return await this.ctx.bean.function.register({ module, name });
    }

    async setLocalesStartup() {
      await this.ctx.bean.function.setLocales({ reset: true });
    }

    async scenes({ sceneMenu }) {
      return await this.ctx.bean.function.scenes({ sceneMenu });
    }

  }

  return Function;
};
