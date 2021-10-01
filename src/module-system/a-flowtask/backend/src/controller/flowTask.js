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

    async appendHandleRemark() {
      const res = await this.ctx.service.flowTask.appendHandleRemark({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async assignees() {
      const res = await this.ctx.service.flowTask.assignees({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async assigneesConfirmation() {
      const res = await this.ctx.service.flowTask.assigneesConfirmation({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async recall() {
      const res = await this.ctx.service.flowTask.recall({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async cancelFlow() {
      const res = await this.ctx.service.flowTask.cancelFlow({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async viewAtom() {
      const res = await this.ctx.service.flowTask.viewAtom({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async editAtom() {
      const res = await this.ctx.service.flowTask.editAtom({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async userSelectForward() {
      const { flowTaskId, params } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const page = params.page;
      const items = await this.ctx.service.flowTask.userSelectForward({
        flowTaskId,
        params,
        user,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async forward() {
      const res = await this.ctx.service.flowTask.forward({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }
  return FlowTaskController;
};
