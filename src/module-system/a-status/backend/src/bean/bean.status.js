module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Status extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'status');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async get(name) {
      const status = await ctx.db.get('aStatus', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      return status ? JSON.parse(status.value) : undefined;
    }

    async set(name, value) {
      await this._set({ name, value, queue: true });
    }

    async _set({ name, value, queue }) {
      const status = await ctx.db.get('aStatus', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      if (status) {
        await ctx.db.update('aStatus', {
          id: status.id,
          value: JSON.stringify(value),
        });
      } else {
        if (queue) {
          await ctx.app.meta.util.lock({
            subdomain: ctx.subdomain,
            resource: `${moduleInfo.relativeName}.statusSet.${this.moduleName}.${name}`,
            fn: async () => {
              return await ctx.meta.util.executeBeanIsolate({
                beanModule: moduleInfo.relativeName,
                fn: async ({ ctx }) => {
                  return await ctx.bean.status.module(this.moduleName)._set({ name, value, queue: false });
                },
              });
            },
          });
        } else {
          await ctx.db.insert('aStatus', {
            iid: ctx.instance.id,
            module: this.moduleName,
            name,
            value: JSON.stringify(value),
          });
        }
      }
    }
  }

  return Status;
};
