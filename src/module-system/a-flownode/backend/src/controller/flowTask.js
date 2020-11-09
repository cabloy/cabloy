module.exports = app => {

  class FlowTaskController extends app.Controller {

    // options
    //   where, orders, page, history
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page);
      const items = await this.ctx.service.flowTask.select({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

  }
  return FlowTaskController;
};

