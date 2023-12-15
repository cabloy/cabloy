module.exports = class RoleController {
  async childrenTop() {
    const page = this.ctx.request.body.page;
    const items = await this.service.role.childrenTop({
      roleTypes: this.ctx.request.body.roleTypes,
      page,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, page.index, page.size);
  }

  async children() {
    const page = this.ctx.request.body.page;
    const items = await this.service.role.children({
      roleTypes: this.ctx.request.body.roleTypes,
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

  async roleUsers() {
    const page = this.ctx.request.body.page;
    const items = await this.service.role.roleUsers({
      roleAtomId: this.ctx.request.body.key.atomId,
      page,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, page.index, page.size);
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

  async addUserRole() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.role.addUserRole({
      roleAtomId: this.ctx.request.body.key.atomId,
      userId: this.ctx.request.body.userId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async deleteUserRole() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.role.deleteUserRole({
      roleAtomId: this.ctx.request.body.key.atomId,
      userId: this.ctx.request.body.userId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
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

  async removeRoleInc() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.role.removeRoleInc({
      roleAtomId: this.ctx.request.body.key.atomId,
      roleIdInc: this.ctx.request.body.roleIdInc,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
};
