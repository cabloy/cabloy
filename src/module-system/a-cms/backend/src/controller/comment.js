module.exports = app => {

  class CommentController extends app.Controller {

    async allP() {
      // options
      const options = JSON.parse(this.ctx.request.query.options);
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
