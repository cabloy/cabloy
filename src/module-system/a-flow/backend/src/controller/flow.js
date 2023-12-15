module.exports = class FlowController {
  // options
  //   where, orders, page, mode: mine/others/flowing/history
  async select() {
    const options = this.ctx.request.body.options;
    options.page = this.ctx.bean.util.page(options.page);
    const items = await this.ctx.service.flow.select({
      options,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, options.page.index, options.page.size);
  }

  async count() {
    const options = this.ctx.request.body.options;
    const count = await this.ctx.service.flow.count({
      options,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(count);
  }
};
