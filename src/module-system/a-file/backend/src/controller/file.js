module.exports = class FileController {
  async all() {
    const options = this.ctx.request.body.options;
    options.page = this.ctx.bean.util.page(options.page);
    const items = await this.ctx.service.file.all({
      atomClass: this.ctx.request.body.atomClass,
      options,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, options.page.index, options.page.size);
  }

  async list() {
    const options = this.ctx.request.body.options;
    options.page = this.ctx.bean.util.page(options.page, false);
    const items = await this.ctx.service.file.list({
      key: this.ctx.request.body.key,
      options: this.ctx.request.body.options,
      user: this.ctx.state.user.op,
    });
    this.ctx.successMore(items, options.page.index, options.page.size);
  }

  async update() {
    const res = await this.ctx.service.file.update({
      fileId: this.ctx.request.body.fileId,
      data: this.ctx.request.body.data,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async delete() {
    const res = await this.ctx.service.file.delete({
      fileId: this.ctx.request.body.fileId || this.ctx.request.body.data.fileId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async upload() {
    const res = await this.service.file.upload({
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async uploadDataUrl() {
    const res = await this.service.file.uploadDataUrl({
      data: this.ctx.request.body.data,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async download() {
    await this.service.file.download({
      downloadId: this.ctx.params.downloadId,
      atomId: parseInt(this.ctx.query.atomId || 0),
      width: this.ctx.query.width,
      height: this.ctx.query.height,
      user: this.ctx.state.user.op,
    });
  }
};
