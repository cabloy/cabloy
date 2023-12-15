const moduleInfo = module.info;
module.exports = class Version {
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
          fn: async ({ ctx }) => {
            const beanFullName = `${moduleInfo.relativeName}.version.manager`;
            const beanInstance = ctx.bean._newBean(beanFullName);
            await beanInstance._update8AuthsInstance();
          },
        });
      }
    }
  }

  async init(options) {
    if (options.version === 1) {
      // empty
    }
  }

  async _update8AuthsInstance() {
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
};
