const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Status {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's status
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
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
          await ctx.app.meta.queue.pushAsync({
            subdomain: ctx.subdomain,
            module: moduleInfo.relativeName,
            queueName: 'statusSet',
            data: {
              module: this.moduleName,
              name,
              value,
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
