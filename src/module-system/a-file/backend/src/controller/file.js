module.exports = app => {
  class FileController extends app.Controller {

    async list() {
      const user = this.ctx.state.user.op;
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page, false);
      // where
      options.where = options.where || {};
      // check right: atom.read or user's files
      const key = this.ctx.request.body.key;
      const atomId = key && key.atomId;
      if (atomId) {
        const res = await this.ctx.bean.atom.checkRightRead({
          atom: { id: atomId },
          user,
        });
        if (!res) this.ctx.throw(403);
        options.where.atomId = atomId; // add where
      } else {
        options.where.userId = user.id; // add where
      }
      //
      const items = await this.ctx.service.file.list({ options });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async delete() {
      //
      const user = this.ctx.state.user.op;
      const data = this.ctx.request.body.data;
      // file
      const item = await this.ctx.model.file.get({ id: data.fileId });
      // check right: atom.write or user's file
      if (item.atomId) {
        const res = await this.ctx.bean.atom.checkRightUpdate({
          atom: { id: item.atomId, action: 3 },
          user,
        });
        if (!res) this.ctx.throw(403);
      } else {
        if (item.userId !== user.id) this.ctx.throw(403);
      }
      //
      const res = await this.ctx.service.file.delete({ data });
      this.ctx.success(res);
    }

    async uploadInner() {
      const res = await this.service.file.uploadInner({
        file: this.ctx.request.body.file,
        meta: this.ctx.request.body.meta,
        user: this.ctx.state.user ? this.ctx.state.user.op : null,
      });
      this.ctx.success(res);
    }

    async upload() {
      const res = await this.service.file.upload({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async download() {
      await this.service.file.download({
        downloadId: this.ctx.params.downloadId,
        width: this.ctx.query.width,
        height: this.ctx.query.height,
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
