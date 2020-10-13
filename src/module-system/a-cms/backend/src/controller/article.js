const require3 = require('require3');
const extend = require3('extend2');
const utils = require('../common/utils.js');

module.exports = app => {

  class ArticleController extends app.Controller {

    // list
    async list() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // stage
      options.stage = 'archive';
      // user
      const user = this.ctx.state.user.op;
      // select
      options.page = this.ctx.bean.util.page(options.page, false);
      const items = await this.ctx.bean.atom.select({ atomClass, options, user, pageForce: false });
      // ok
      this.ctx.successMore(items, options.page.index, options.page.size);
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

