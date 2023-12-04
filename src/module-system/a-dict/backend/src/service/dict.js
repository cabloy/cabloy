module.exports = app => {
  class Dict extends app.Service {
    async getDict({ dictKey, user }) {
      // check right
      const res = await this.ctx.bean.dict._prepareDict_load({ dictKey, user, returnDict: false });
      if (!res) this.ctx.throw(403);
      // get dict
      const dict = await this.ctx.bean.dict.getDict({ dictKey });
      // short
      return {
        dictKey,
        atomId: dict.atomId,
        description: dict.description,
        dictMode: dict.dictMode,
        _dictItems: dict._dictItems,
      };
    }
  }

  return Dict;
};
