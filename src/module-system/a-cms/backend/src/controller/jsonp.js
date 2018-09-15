const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {

  class JSONPController extends app.Controller {

    async articleList() {
      // options
      let options;
      if (this.ctx.acceptJSONP) {
        options = JSON.parse(decodeURIComponent(this.ctx.request.query.options));
      } else {
        options = this.ctx.request.body.options;
      }
      options.where = extend(true, options.where, {
        'a.atomEnabled': 1,
        'a.atomFlag': 2,
      });
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/atom/select',
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
  return JSONPController;
};

