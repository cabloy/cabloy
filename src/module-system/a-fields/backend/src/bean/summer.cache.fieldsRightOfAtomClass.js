module.exports = class SummerCache {
  async get(key) {
    return await this.ctx.bean.fields.__getFieldsRightOfAtomClassRaw(key);
  }
};
