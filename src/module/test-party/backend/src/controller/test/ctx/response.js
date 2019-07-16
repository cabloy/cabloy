module.exports = app => {

  class ResponseController extends app.Controller {

    async success() {
      const res = {
        userName: 'zhennann',
      };
      this.ctx.success(res);
    }

    async successMore() {
      const page = this.ctx.request.body.page;
      const items = [
        { userName: 'zhennann' },
        { userName: 'root' },
      ];
      this.ctx.successMore(items, page.index, page.size);
    }

    async fail() {
      // Error Test
      this.ctx.fail(1001);
    }

    async throwError() {
      this.ctx.throw(1001);
    }

  }

  return ResponseController;
};
