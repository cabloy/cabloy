module.exports = app => {
  class AtomRightController extends app.Controller {

    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.atomRight.rights({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      const res = await this.service.atomRight.add({
        roleId: this.ctx.request.body.roleId,
        atomClass: this.ctx.request.body.atomClass,
        actionCode: this.ctx.request.body.actionCode,
        scopeSelf: this.ctx.request.body.scopeSelf,
        scope: this.ctx.request.body.scope,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.service.atomRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.atomRight.spreads({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

  }
  return AtomRightController;
};
