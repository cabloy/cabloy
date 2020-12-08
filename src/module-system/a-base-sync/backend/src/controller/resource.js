module.exports = app => {

  class ResourceController extends app.Controller {

    // options
    //   where, orders, page, star, label, resourceType, locale
    async select() {
      const options = this.ctx.request.body.options || {};
      options.page = this.ctx.bean.util.page(options.page, false); // false
      const items = await this.ctx.service.resource.select({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async check() {
      const res = await this.ctx.service.resource.check({
        atomStaticKeys: this.ctx.request.body.atomStaticKeys,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async resourceRoles() {
      const list = await this.ctx.service.resource.resourceRoles({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success({ list });
    }

    async resourceRoleRemove() {
      const res = await this.ctx.service.resource.resourceRoleRemove({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }

  return ResourceController;
};
