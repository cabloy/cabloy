module.exports = app => {

  class Site extends app.Service {

    async getConfigSite() {
      return await this.ctx.meta.status.get('config-site');
    }

    async getConfigLanguage({ language }) {
      return await this.ctx.meta.status.get(`config-${language}`);
    }

  }

  return Site;
};
