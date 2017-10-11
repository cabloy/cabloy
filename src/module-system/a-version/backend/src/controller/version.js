/*
* @Author: zhennann
* @Date:   2017-09-08 14:48:59
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 18:07:55
*/

module.exports = app => {
  class VersionController extends app.Controller {

    // check all modules
    async check() {
      await this.service.version.check();
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

    // update this module
    async update() {
      await this.service.version.update(this.ctx.getInt('version'));
      this.ctx.success();
    }

    // result
    async result() {
      const res = this.service.version.result();
      this.ctx.success(res);
    }

  }
  return VersionController;
};
