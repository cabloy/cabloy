module.exports = ctx => {
  const moduleInfo = module.info;
  class CacheDb extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, `${moduleInfo.relativeName}.local.db`);
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async get(name) {
      const res = await this._has(name);
      return res ? JSON.parse(res.value) : undefined;
    }

    async set(name, value, timeout) {
      await this._set({ name, value, timeout, queue: true });
    }

    async getset(name, value, timeout) {
      const res = await this._set({ name, value, timeout, queue: true });
      return res ? JSON.parse(res.value) : undefined;
    }

    async _set({ name, value, timeout, queue }) {
      // second
      const second = timeout ? parseInt(timeout / 1000) : timeout;
      // expired
      const expired = second ? `TIMESTAMPADD(SECOND,${second},CURRENT_TIMESTAMP)` : 'null';
      const res = await ctx.db.get('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
        name,
      });
      if (res) {
        await ctx.db.query(
          `
          update aCache set value=?, expired=${expired}
            where id=?
          `,
          [JSON.stringify(value), res.id]
        );
      } else {
        if (queue) {
          await ctx.meta.util.lock({
            resource: `${moduleInfo.relativeName}.cacheDbSet.${this.moduleName}.${name}`,
            fn: async () => {
              return await ctx.meta.util.executeBeanIsolate({
                beanModule: moduleInfo.relativeName,
                fn: async ({ ctx }) => {
                  return await ctx.cache._db.module(this.moduleName)._set({ name, value, timeout, queue: false });
                },
              });
            },
          });
        } else {
          await ctx.db.query(
            `
            insert into aCache(iid,module,name,value,expired) values(?,?,?,?,${expired})
            `,
            [ctx.instance ? ctx.instance.id : 0, this.moduleName, name, JSON.stringify(value)]
          );
        }
      }
      // return old value
      if (!res) return null;
      if (!res.expired || res.expired.getTime() > new Date().getTime()) return res;
      return null;
    }

    async has(name) {
      const res = await this._has(name);
      return !!res;
    }

    async _has(name) {
      const sql =
        'select * from aCache where iid=? and module=? and name=? and (expired is null or expired>CURRENT_TIMESTAMP)';
      const res = await ctx.db.queryOne(sql, [ctx.instance ? ctx.instance.id : 0, this.moduleName, name]);
      return res;
    }

    async remove(name) {
      await ctx.db.delete('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
        name,
      });
    }

    async clear() {
      await ctx.db.delete('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
      });
    }
  }

  return CacheDb;
};
