const require3 = require('require3');
const extend = require3('extend2');
const utils = require('../common/utils.js');

module.exports = app => {

  class ArticleController extends app.Controller {

    async create() {
      const res = await this.ctx.service.article.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.article.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.article.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.article.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.article.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.article.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.article.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

    // list
    async list() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // select
      // filter drafts
      options.where = extend(true, options.where, {
        'a.atomEnabled': 1, // normal mode
        'a.atomFlag': 2, // published
      });
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/atom/select',
        body: {
          atomClass,
          options,
        },
      });
      // ok
      this.ctx.success(res);
    }

    // attachments
    async attachments() {
      // key
      const key = this.ctx.request.body.key;
      // options
      const options = this.ctx.request.body.options || {};
      // filter drafts
      options.where = extend(true, options.where, {
        mode: 2,
        attachment: 1,
      });
      if (!options.orders) {
        options.orders = [
          [ 'realName', 'asc' ],
        ];
      }
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/file/file/list',
        body: {
          key,
          options,
        },
      });
      this.ctx.success(res);
    }

  }
  return ArticleController;
};

