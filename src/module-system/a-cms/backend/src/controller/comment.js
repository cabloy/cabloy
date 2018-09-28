const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {

  class CommentController extends app.Controller {

    async allP() {
      // options
      const options = JSON.parse(this.ctx.request.query.options);
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
          atomClass: {
            module: 'a-cms',
            atomClassName: 'article',
          },
          options,
        },
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};
