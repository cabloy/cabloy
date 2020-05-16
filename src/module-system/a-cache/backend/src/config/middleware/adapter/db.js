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
        await ctx.db.query(`
          update aCache set value=?, expired=${expired}
            where id=?
          `, [ JSON.stringify(value), res.id ]);
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
          await ctx.db.query(`
            insert into aCache(iid,module,name,value,expired) values(?,?,?,?,${expired})
            `, [ ctx.instance ? ctx.instance.id : 0, this.moduleName, name, JSON.stringify(value) ]);
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
      const sql = 'select * from aCache where iid=? and module=? and name=? and (expired is null or expired>CURRENT_TIMESTAMP)';
      const res = await ctx.db.queryOne(sql, [ ctx.instance ? ctx.instance.id : 0, this.moduleName, name ]);
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
