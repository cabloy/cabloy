const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = app => {
  class Auth extends app.Service {
    async list() {
      return this.ctx.bean.authProviderCache.getAuthProvidersConfigForAdmin();
    }

    async disable({ id, disabled }) {
      // update
      await this.ctx.model.authProvider.update({ id, disabled });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }

    async item({ id }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // meta
      const authProvider = this.ctx.bean.authProvider.getAuthProviderBase({
        module: item.module,
        providerName: item.providerName,
      });
      if (authProvider.meta.mode === 'redirect') {
        const moduleInfo = mparse.parseInfo(item.module);
        const loginURL = this.ctx.bean.base.getAbsoluteUrl(
          `/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}`
        );
        const callbackURL = this.ctx.bean.base.getAbsoluteUrl(
          `/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}/callback`
        );
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
      this.ctx.meta.util.broadcastEmit({
        module: 'a-auth',
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
