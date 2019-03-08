module.exports = app => {
  class FileController extends app.Controller {

    async list() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page, false);
      const items = await this.ctx.service.file.list({
        key: this.ctx.request.body.key,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async delete() {
      const res = await this.ctx.service.file.delete({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

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

    // inner invoke
    async fileInfo() {
      const res = await this.service.file.fileInfo({
        downloadId: this.ctx.params.downloadId,
      });
      this.ctx.success(res);
    }

  }
  return FileController;
};
