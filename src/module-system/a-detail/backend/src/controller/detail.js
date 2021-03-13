module.exports = app => {

  class DetailController extends app.Controller {

    async create() {
      const res = await this.ctx.service.detail.create({
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.detail.read({
        key: this.ctx.request.body.key,
        options: this.ctx.request.body.options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    // options
    //   where, orders, page, star, label
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page, false); // false
      const items = await this.ctx.service.detail.select({
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.detail.count({
        atomKey: this.ctx.request.body.atomKey,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

    async write() {
      const options = { ignoreValidate: false };
      await this.ctx.service.detail.write({
        key: this.ctx.request.body.key,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
        options,
      });
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.detail.delete({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success();
    }

  }
  return DetailController;
};

