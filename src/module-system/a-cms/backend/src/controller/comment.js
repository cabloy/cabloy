const utils = require('../common/utils.js');

module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // stage
      options.stage = 'formal';
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
