module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
      if (options.version === 2) {
        // all instances
        const instances = await this.ctx.bean.instance.list({ where: {} });
        for (const instance of instances) {
          await this.ctx.meta.util.executeBean({
            subdomain: instance.name,
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.version.manager`,
            context: options,
            fn: 'update8Auths',
          });
        }
      }
    }

    async init(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async update8Auths(options) {
      const provideItem = await this.ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authgithub',
      });
      await this.ctx.model.query('update aAuth a set a.providerScene=? where a.iid=? and a.providerId=?', [
        'default',
        this.ctx.instance.id,
        provideItem.id,
      ]);
    }
  }

  return Version;
};
