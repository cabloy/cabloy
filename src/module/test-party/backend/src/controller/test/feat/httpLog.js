module.exports = app => {

  class HttpLogController extends app.Controller {

    async httpLog() {
      // please see: {projectDir}/src/backend/logs/{projectName}/{projectName}-web.log
      this.ctx.success('this is a test for httpLog');
    }

  }

  return HttpLogController;
};

