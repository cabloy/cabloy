module.exports = app => {
  class FileController extends app.Controller {

    async all() {
      const options = this.ctx.request.body.options;
      options.file = 1;
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/atom/select',
        body: {
          atomClass: this.ctx.request.body.atomClass,
          options,
        },
      });
      for (const item of res.list) {
        item.i_downloadUrl = this.ctx.service.file.getDownloadUrl({
          downloadId: item.i_downloadId,
          atomId: item.atomId,
          mode: item.i_mode,
          fileExt: item.i_fileExt,
        });
      }
      this.ctx.success(res);
    }

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
          checkFlow: true,
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

    async update() {
      //
      const user = this.ctx.state.user.op;
      const fileId = this.ctx.request.body.fileId;
      const data = this.ctx.request.body.data;
      // file
      const file = await this.ctx.model.file.get({ id: fileId });
      // check right
      await this.ctx.service.file.fileUpdateCheck({ file, user });
      // rename
      const res = await this.ctx.service.file.update({ fileId, data });
      this.ctx.success(res);
    }

    async delete() {
      //
      const user = this.ctx.state.user.op;
      let fileId = this.ctx.request.body.fileId;
      if (!fileId) {
        fileId = this.ctx.request.body.data.fileId;
      }
      // file
      const file = await this.ctx.model.file.get({ id: fileId });
      // check right
      await this.ctx.service.file.fileUpdateCheck({ file, user });
      // delete
      const res = await this.ctx.service.file.delete({ fileId });
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
        atomId: parseInt(this.ctx.query.atomId || 0),
        width: this.ctx.query.width,
        height: this.ctx.query.height,
      });
    }

  }
  return FileController;
};
