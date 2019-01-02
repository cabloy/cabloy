const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheDb {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's cache
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    async get(name) {
      const res = await this.has(name);
      return res ? JSON.parse(res.value) : undefined;
    }

    async set(name, value, timeout) {
      await this._set({ name, value, timeout, queue: true });
    }

    async _set({ name, value, timeout, queue }) {
      const res = await ctx.db.get('aCache', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      if (res) {
        await ctx.db.update('aCache', {
          id: res.id,
          value: JSON.stringify(value),
          timeout: timeout || 0,
        });
      } else {
        if (queue) {
          await ctx.app.meta.queue.pushAsync({
            subdomain: ctx.subdomain,
            module: moduleInfo.relativeName,
            queueName: 'cacheDbSet',
            data: {
              module: this.moduleName,
              name,
              value,
              timeout,
            },
          });
        } else {
          await ctx.db.insert('aCache', {
            iid: ctx.instance.id,
            module: this.moduleName,
            name,
            value: JSON.stringify(value),
            timeout: timeout || 0,
          });
        }
      }
    }

    async has(name) {
      const sql = 'select * from aCache where iid=? and module=? and name=? and (timeout=0 or timestampdiff(SECOND,updatedAt,now())*1000 < timeout)';
      const res = await ctx.db.queryOne(sql, [ ctx.instance.id, this.moduleName, name ]);
      return res;
    }

    async remove(name) {
      await ctx.db.delete('aCache', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
    }

    async clear() {
      await ctx.db.delete('aCache', {
        iid: ctx.instance.id,
        module: this.moduleName,
      });
    }

  }

  return CacheDb;
};
