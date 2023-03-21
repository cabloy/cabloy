module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const { fullKey, keysHash, keys, options } = context.data;
      if (!sameAsCaller) {
        const cache = this.ctx.bean.summer.getCache(fullKey);
        cache.localMem.__mdelRaw(keysHash, keys, options);
      }
    }
  }

  return Broadcast;
};
