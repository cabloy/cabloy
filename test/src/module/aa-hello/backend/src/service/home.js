module.exports = app => {

  class Home extends app.Service {

    async index() {
      return this.ctx.text(this.ctx.config.message, 'zhennann');
    }

  }

  return Home;
};
