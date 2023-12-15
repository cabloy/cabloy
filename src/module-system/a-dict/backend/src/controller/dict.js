module.exports = class DictController {
  async getDict() {
    const res = await this.ctx.service.dict.getDict({
      dictKey: this.ctx.request.body.dictKey,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
};
