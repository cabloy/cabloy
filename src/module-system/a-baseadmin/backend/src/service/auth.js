const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = app => {

  class Auth extends app.Service {

    async list() {
      // list
      const list = await this.ctx.model.authProvider.select();
      // meta
      const authProviders = this.ctx.meta.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        item.meta = authProvider ? authProvider.meta : null;
      }
      // ok
      return list;
    }

    async disable({ id, disabled }) {
      // update
      await this.ctx.model.authProvider.update({ id, disabled });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // broadcast
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'a-base',
        broadcastName: 'authProviderChanged',
        data: {
          module: item.module,
          providerName: item.providerName,
        },
      });
    }

    async item({ id }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // meta
      const authProviders = this.ctx.meta.base.authProviders();
      const authProvider = authProviders[`${item.module}:${item.providerName}`];
      if (authProvider.meta.mode === 'redirect') {
        const moduleInfo = mparse.parseInfo(item.module);
        const loginURL = this.ctx.meta.base.getAbsoluteUrl(`/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}`);
        const callbackURL = this.ctx.meta.base.getAbsoluteUrl(`/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}/callback`);
        item._meta = {
          loginURL,
          callbackURL,
        };
      }
      // ok
      return item;
    }

    async save({ id, config }) {
      // update
      await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // broadcast
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'a-base',
        broadcastName: 'authProviderChanged',
        data: {
          module: item.module,
          providerName: item.providerName,
        },
      });
    }

  }

  return Auth;
};
