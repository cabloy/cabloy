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

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.flowTask.count({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

    async claim() {
      const res = await this.ctx.service.flowTask.claim({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async complete() {
      const res = await this.ctx.service.flowTask.complete({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        formAtom: this.ctx.request.body.formAtom,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return FlowTaskController;
};

