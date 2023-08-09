module.exports = app => {
  class ModelCache extends app.meta.Model {
    constructor(ctx, { table, options = {} }) {
      super(ctx, { table, options });
      this.__cacheName = options.cacheName;
    }

    async mget(ids) {
      // cache
      const cache = this.__getCacheInstance();
      return await cache.mget(ids, {
        fn_mget: async keys => {
          return await this.select({
            where: {
              id: keys,
            },
          });
        },
      });
    }

    async get(where, ...args) {
      const keys = Object.keys(where);
      if (keys.length !== 1 || keys[0] !== 'id') {
        return await super.get(where, ...args);
      }
      // cache
      const cache = this.__getCacheInstance();
      return await cache.get(where.id, {
        fn_get: async key => {
          return await super.get({ id: key }, ...args);
        },
      });
    }

    async update(where, ...args) {
      const res = await super.update(where, ...args);
      this.__deleteCache(where);
      return res;
    }

    async delete(where, ...args) {
      const res = await super.delete(where, ...args);
      this.__deleteCache(where);
      return res;
    }

    async __deleteCache(where) {
      if (!where.id) return;
      const cache = this.__getCacheInstance();
      await cache.del(where.id);
    }

    __getCacheInstance() {
      return this.ctx.bean.summer.getCache(this.__cacheName);
    }
  }

  return ModelCache;
};
