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
      console.log('---------------         update8Auths');
    }
  }

  return Version;
};
