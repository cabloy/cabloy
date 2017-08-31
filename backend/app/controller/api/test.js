/*
* @Author: zhennann
* @Date:   2017-08-30 11:34:01
* @Last Modified by:   zhennann
* @Last Modified time: 2017-08-30 11:56:40
*/

module.exports = app => {
  class TestController extends app.Controller {
    async index() {
      this.ctx.body = 'Hello world';
    }
  }
  return TestController;
};
