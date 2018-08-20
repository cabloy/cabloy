module.exports = app => {
  class FileController extends app.Controller {

    async upload() {
      const res = await this.service.file.upload({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async download() {
      await this.service.file.download({
        downloadId: this.ctx.params.downloadId,
        width: this.ctx.query.width,
        height: this.ctx.query.height,
        user: this.ctx.user.op,
      });
    }

  }
  return FileController;
};
