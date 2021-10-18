module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      // const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      this.ctx.bean.dict._broadcastDictCacheRemove({ dictKey: data.dictKey });
    }
  }

  return Broadcast;
};
