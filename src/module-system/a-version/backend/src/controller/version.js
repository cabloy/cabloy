module.exports = app => {
  class VersionController extends app.Controller {

    // check all modules
    async check() {
      // options: 
      //   scene:init
      //   scene:test      
      const options = this.ctx.request.body;
      await this.service.version.check(options);
      this.ctx.success();
    }

    // update module
    async updateModule() {
      await this.service.version.updateModule(
        this.ctx.request.body.module,
        this.ctx.getInt('version')
      );
      this.ctx.success();
    }

    // init module
    async initModule() {
      await this.service.version.initModule(
        this.ctx.request.body
      );
      this.ctx.success();
    }

    // test module
    async testModule() {
      await this.service.version.testModule(
        this.ctx.request.body
      );
      this.ctx.success();
    }

    // update this module
    async update() {
      await this.service.version.update(this.ctx.getInt('version'));
      this.ctx.success();
    }

    // result
    async result() {
      if (app.config.env !== 'local') this.ctx.throw(1003);
      const res = this.service.version.result();
      this.ctx.success(res);
    }

  }
  return VersionController;
};
