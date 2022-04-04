module.exports = app => {
  class ResourceRightController extends app.Controller {
    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.resourceRight.rights({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.resourceRight.add({
        roleAtomId: this.ctx.request.body.key.atomId,
        atomIds: this.ctx.request.body.atomIds,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.resourceRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.resourceRight.spreads({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return ResourceRightController;
};
