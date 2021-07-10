module.exports = ctx => {
  class ctxBean {
    async actionAsync3({ a, b }) {
      return await this.actionAsync2({ a, b });
    }
  }

  return ctxBean;
};
