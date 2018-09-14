module.exports = app => {

  class JSONPController extends app.Controller {

    async articleList() {
      const res = { list: [ 1, 2, 3 ] };
      this.ctx.success(res);
    }

  }
  return JSONPController;
};

