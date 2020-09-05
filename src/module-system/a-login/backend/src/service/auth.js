module.exports = app => {

  class Auth extends app.Service {

    async list() {
      // list
      const list = await this.ctx.model.query(`
        select a.id, a.module,a.providerName from aAuthProvider a
          where a.iid=? and a.disabled=0
        `, [ this.ctx.instance.id ]);
      // list map
      const listMap = {};
      // meta
      const authProviders = this.ctx.bean.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        if (!authProvider) continue;
        item.meta = authProvider.meta;
        listMap[key] = item;
      }
      // order
      const res = [];
      for (const item of this.ctx.config.providers) {
        const key = `${item.module}:${item.provider}`;
        const provider = listMap[key];
        if (provider) {
          if (item.disable !== true) {
            res.push(provider);
          }
          delete listMap[key];
        }
      }
      // the rest
      for (const key in listMap) {
        res.push(listMap[key]);
      }
      // ok
      return res;
    }

  }

  return Auth;
};
