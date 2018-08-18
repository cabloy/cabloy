module.exports = app => {
  class FileController extends app.Controller {

    async upload() {
      const res = await this.service.file.upload();
      this.ctx.success(res);
    }

  }
  return FileController;
};
