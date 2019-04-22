module.exports = app => {

  class Auth extends app.Service {

    async list() {
      // list
      const list = await this.ctx.model.query(`
        select a.module,a.providerName from aAuthProvider a
          where a.iid=? and a.disabled=0
        `, [ this.ctx.instance.id ]);
      // meta
      const authProviders = this.ctx.meta.base.authProviders();
      for (const item of list) {
        const authProvider = authProviders[`${item.module}:${item.providerName}`];
        item.meta = authProvider.meta;
      }
      // ok
      return list;
    }

  }

  return Auth;
};
