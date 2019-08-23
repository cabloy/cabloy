module.exports = app => {

  class GuideController extends app.Controller {

    async echo() {
      const message = 'Hello World';
      this.ctx.success(message);
    }

    async echo2() {
      const message = this.ctx.config.message;
      this.ctx.success(message);
    }

    async echo3() {
      const message = this.ctx.text('Hello World');
      this.ctx.success(message);
    }

    async echo4() {
      const { message, markCount } = this.ctx.request.body;
      const res = `${message}${new Array(markCount + 1).join('!')}`;
      this.ctx.success(res);
    }

  }

  return GuideController;
};

