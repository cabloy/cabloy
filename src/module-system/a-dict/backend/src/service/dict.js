module.exports = app => {
  class Dict extends app.Service {
    async getDict({ dictKey, user }) {
      // check right
      const res = await this._prepareDict_load({ dictKey, user, returnDict: false });
      if (!res) this.ctx.throw(403);
      // get dict
      return await this.ctx.bean.dict.getDict({ dictKey });
    }
  }

  return Dict;
};
