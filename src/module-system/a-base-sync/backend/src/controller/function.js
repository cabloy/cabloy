module.exports = app => {

  class FunctionController extends app.Controller {

    // options
    //   where, orders, page, star,language
    async list() {
      const options = this.ctx.request.body.options || {};
      options.page = this.ctx.meta.util.page(options.page, false); // false
      // locale maybe '' for selectAllFunctions
      if (options.locale === undefined) options.locale = this.ctx.locale;
      const items = await this.ctx.service.function.list({
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async star() {
      const res = await this.ctx.service.function.star({
        id: this.ctx.request.body.id,
        star: this.ctx.request.body.star,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async check() {
      const res = await this.ctx.service.function.check({
        functions: this.ctx.request.body.functions,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async checkLocale() {
      const res = await this.ctx.service.function.checkLocale({
        locale: this.ctx.request.body.locale,
      });
      this.ctx.success(res);
    }

    async register() {
      const res = await this.ctx.service.function.register({
        module: this.ctx.request.body.module,
        name: this.ctx.request.body.name,
      });
      this.ctx.success(res);
    }

    // startup
    async clearLocales() {
      const res = await this.ctx.service.function.clearLocales();
      this.ctx.success(res);
    }

    // startup
    async setSceneSorting() {
      const res = await this.ctx.service.function.setSceneSorting();
      this.ctx.success(res);
    }

    async scenes() {
      const res = await this.ctx.service.function.scenes({
        sceneMenu: this.ctx.request.body.sceneMenu,
      });
      this.ctx.success(res);
    }

  }

  return FunctionController;
};
