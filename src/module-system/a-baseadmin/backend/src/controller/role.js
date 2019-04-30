module.exports = app => {
  class RoleController extends app.Controller {

    async children() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.children({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async item() {
      const res = await this.service.role.item({
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async save() {
      await this.service.role.save({
        roleId: this.ctx.request.body.roleId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async add() {
      const res = await this.service.role.add({
        roleIdParent: this.ctx.request.body.roleIdParent,
        catalog: this.ctx.request.body.catalog,
      });
      this.ctx.success(res);
    }

    async move() {
      const res = await this.service.role.move({
        roleId: this.ctx.request.body.roleId,
        roleIdParent: this.ctx.request.body.roleIdParent,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.service.role.delete({
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async includes() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.includes({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addRoleInc() {
      const res = await this.service.role.addRoleInc({
        roleId: this.ctx.request.body.roleId,
        roleIdInc: this.ctx.request.body.roleIdInc,
      });
      this.ctx.success(res);
    }

    async removeRoleInc() {
      const res = await this.service.role.removeRoleInc({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async dirty() {
      const res = await this.service.role.dirty();
      this.ctx.success(res);
    }

    async build() {
      const res = await this.service.role.build();
      this.ctx.success(res);
    }

    async buildInBackground() {
      const res = await this.service.role.buildInBackground({
        progressId: this.ctx.request.body.progressId,
      });
      this.ctx.success(res);
    }


  }
  return RoleController;
};
