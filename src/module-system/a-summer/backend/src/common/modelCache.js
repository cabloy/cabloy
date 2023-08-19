module.exports = app => {
  class ModelCache extends app.meta.Model {
    constructor(ctx, { table, options = {} }) {
      super(ctx, { table, options });
      this.__cacheName = options.cacheName;
      this.__cacheKeyAux = options.cacheKeyAux;
      this.__cacheNotKey = options.cacheNotKey;
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
      if (!this.__checkCacheKeyValid(where)) {
        if (this.__cacheNotKey) {
          return await this.__get_notkey(where, ...args);
        }
        return await super.get(where, ...args);
      }
      return await this.__get_key(where, ...args);
    }

    async update(where, ...args) {
      const res = await super.update(where, ...args);
      this.__deleteCache_key(where);
      return res;
    }

    async delete(where, ...args) {
      const res = await super.delete(where, ...args);
      this.__deleteCache_key(where);
      return res;
    }

    async __get_notkey(where, ...args) {
      // cache
      const cache = this.__getCacheInstance();
      const data = await cache.get(where, {
        fn_get: async () => {
          return await super.get(where, { columns: ['id'] });
        },
        ignoreNull: true,
      });
      if (!data) return data;
      // check if exists
      const data2 = await this.__get_key({ id: data.id }, ...args);
      if (data2) return data2;
      // delete cache
      await this.__deleteCache_notkey(where);
      // get again
      return await this.__get_notkey(where, ...args);
    }

    async __get_key(where, ...args) {
      // cache
      const cache = this.__getCacheInstance();
      return await cache.get(where.id, {
        fn_get: async () => {
          // where: maybe contain aux key
          return await super.get(where, ...args);
        },
      });
    }

    __checkCacheKeyValid(where) {
      let keys = Object.keys(where);
      if (this.__cacheKeyAux) {
        keys = keys.filter(item => item !== this.__cacheKeyAux);
      }
      return keys.length === 1 && keys[0] === 'id';
    }

    async __deleteCache_key(where) {
      if (!where.id) return;
      const cache = this.__getCacheInstance();
      await cache.del(where.id);
    }

    async __deleteCache_notkey(where) {
      const cache = this.__getCacheInstance();
      await cache.del(where);
    }

    __getCacheInstance() {
      return this.ctx.bean.summer.getCache(this.__cacheName);
    }

    async clearSummer() {
      await this.ctx.bean.summer.clear(this.__cacheName);
    }
  }

  return ModelCache;
};
