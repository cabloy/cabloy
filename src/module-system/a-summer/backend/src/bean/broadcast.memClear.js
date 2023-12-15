module.exports = class Broadcast {
  async execute(context) {
    const sameAsCaller = context.sameAsCaller;
    const { fullKey, options } = context.data;
    if (!sameAsCaller) {
      const cache = this.ctx.bean.summer.getCache({ fullKey });
      cache.localMem.__clearRaw(options);
    }
  }
};
