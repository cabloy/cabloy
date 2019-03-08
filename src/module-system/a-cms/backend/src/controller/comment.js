const require3 = require('require3');
const extend = require3('extend2');
const utils = require('../common/utils.js');

module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // filter drafts
      options.where = extend(true, options.where, {
        'a.atomEnabled': 1,
        'a.atomFlag': 2,
      });
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/comment/all',
        body: {
          atomClass,
          options,
        },
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};
