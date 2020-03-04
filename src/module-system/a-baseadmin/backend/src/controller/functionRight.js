module.exports = app => {
  class FunctionRightController extends app.Controller {

    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.functionRight.rights({
        roleId: this.ctx.request.body.roleId,
        menu: this.ctx.request.body.menu,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      const res = await this.service.functionRight.add({
        roleId: this.ctx.request.body.roleId,
        module: this.ctx.request.body.module,
        name: this.ctx.request.body.name,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.service.functionRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.functionRight.spreads({
        roleId: this.ctx.request.body.roleId,
        menu: this.ctx.request.body.menu,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

  }
  return FunctionRightController;
};
