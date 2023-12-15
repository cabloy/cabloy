module.exports = class UserController {
  async select() {
    const page = this.ctx.bean.util.page(this.ctx.request.body.page);
    const items = await this.service.user.select({
      query: this.ctx.request.body.query,
      page,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, page.index, page.size);
  }

  async userRoles() {
    const page = this.ctx.request.body.page;
    const items = await this.service.user.userRoles({
      userAtomId: this.ctx.request.body.key.atomId,
      page,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, page.index, page.size);
  }

  async addUserRole() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.user.addUserRole({
      userAtomId: this.ctx.request.body.key.atomId,
      roleId: this.ctx.request.body.roleId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async deleteUserRole() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.user.deleteUserRole({
      userAtomId: this.ctx.request.body.key.atomId,
      roleId: this.ctx.request.body.roleId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async atomRights() {
    const page = this.ctx.request.body.page;
    const items = await this.service.user.atomRights({
      userAtomId: this.ctx.request.body.key.atomId,
      page,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, page.index, page.size);
  }

  async resourceRights() {
    const page = this.ctx.request.body.page;
    const items = await this.service.user.resourceRights({
      userAtomId: this.ctx.request.body.key.atomId,
      page,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, page.index, page.size);
  }
};
