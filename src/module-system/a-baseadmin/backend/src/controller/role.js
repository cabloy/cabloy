module.exports = app => {
  class RoleController extends app.Controller {
    async childrenTop() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.childrenTop({
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async children() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.children({
        roleId: this.ctx.request.body.roleId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.delete({
        roleAtomId: this.ctx.request.body.key.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async clone() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.clone({
        roleAtomId: this.ctx.request.body.key.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async move() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.move({
        roleAtomId: this.ctx.request.body.key.atomId,
        roleIdParent: this.ctx.request.body.data.roleIdParent,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async addChild() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.addChild({
        roleAtomId: this.ctx.request.body.key.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async includes() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.includes({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addRoleInc() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.addRoleInc({
        roleAtomId: this.ctx.request.body.key.atomId,
        roleIdInc: this.ctx.request.body.roleIdInc,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    // //////

    async item() {
      const roleId = this.ctx.request.body.roleId;
      const user = this.ctx.state.user.op;
      // check right
      const roleAtomId = await this.ctx.bean.role._forceRoleAtomId({ roleId });
      const right = await this.ctx.bean.atom.checkRightRead({
        atom: { id: roleAtomId },
        user,
      });
      if (!right) this.ctx.throw(403);
      // item
      const res = await this.service.role.item({
        roleAtomId,
        roleId,
      });
      this.ctx.success(res);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      await this.service.role.save({
        roleId: this.ctx.request.body.roleId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async removeRoleInc() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.removeRoleInc({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async dirty() {
      const res = await this.service.role.dirty();
      this.ctx.success(res);
    }

    async buildBulk() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.buildBulk();
      this.ctx.success(res);
    }
  }
  return RoleController;
};
