module.exports = app => {
  class UserController extends app.Controller {

    async list() {
      const page = this.ctx.meta.util.page(this.ctx.request.body.page);
      const items = await this.service.user.list({
        roleId: this.ctx.request.body.roleId,
        query: this.ctx.request.body.query,
        anonymous: this.ctx.request.body.anonymous,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async item() {
      const res = await this.service.user.item({
        userId: this.ctx.request.body.userId,
      });
      this.ctx.success(res);
    }

    async disable() {
      const res = await this.service.user.disable({
        userId: this.ctx.request.body.userId,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async delete() {
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
      const res = await this.service.user.addRole({
        userId: this.ctx.request.body.userId,
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async removeRole() {
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

    async functionRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.functionRights({
        menu: this.ctx.request.body.menu,
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

  }
  return UserController;
};
