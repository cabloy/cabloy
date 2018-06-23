module.exports = app => {

  class Auth extends app.Service {

    async list() {
      return await this.ctx.model.authProvider.select();
    }

    async disable({ id, disabled }) {
      await this.ctx.model.authProvider.update({ id, disabled });
    }

    async item({ id }) {
      return await this.ctx.model.authProvider.get({ id });
    }

    async save({ id, config }) {
      await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
    }

  }

  return Auth;
};
