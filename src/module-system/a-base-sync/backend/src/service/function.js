module.exports = app => {

  class Function extends app.Service {

    async list({ options, user }) {
      return await this.ctx.meta.function.list({ options, user });
    }

    async star({ id, star, user }) {
      return await this.ctx.meta.function.star({ id, star, user });
    }

    async check({ functions, user }) {
      return await this.ctx.meta.function.check({ functions, user });
    }

    async register({ module, name }) {
      return await this.ctx.meta.function.register({ module, name });
    }

    async setLocales() {
      // set instance
      await this.ctx.meta.function.setLocales();
    }

    async scenes({ sceneMenu }) {
      return await this.ctx.meta.function.scenes({ sceneMenu });
    }

  }

  return Function;
};
