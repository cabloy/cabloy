module.exports = app => {
  class UserController extends app.Controller {
    async select() {
      const page = this.ctx.bean.util.page(this.ctx.request.body.page);
      const items = await this.service.user.select({
        query: this.ctx.request.body.query,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.delete({
        userId: this.ctx.request.body.userId,
      });
      this.ctx.success(res);
    }

    async roles() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.roles({
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.addRole({
        userId: this.ctx.request.body.userId,
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async removeRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.removeRole({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async atomRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.atomRights({
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async resourceRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.resourceRights({
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return UserController;
};
