module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class File extends app.Service {

    async all({ atomClass, options, user }) {
      return await this.ctx.bean.file.all({ atomClass, options, user });
    }

    // where adjusted by controller
    async list({ key, options, user }) {
      return await this.ctx.bean.file.list({ key, options, user });
    }

    async delete({ fileId }) {
      return await this.ctx.bean.file.delete({ fileId });
    }

    async update({ fileId, data }) {
      return await this.ctx.bean.file.update({ fileId, data });
    }

    async upload({ user }) {
      return await this.ctx.bean.file.upload({ user });
    }

    async download({ downloadId, atomId, width, height }) {
      return await this.ctx.bean.file.download({ downloadId, atomId, width, height });
    }

    // inner invoke
    async fileInfo({ downloadId }) {
      return await this.ctx.bean.file.fileInfo({ downloadId });
    }

    async fileUpdateCheck({ file, user }) {
      return await this.ctx.bean.file.fileUpdateCheck({ file, user });
    }

    async fileDownloadCheck({ file, user }) {
      return await this.ctx.bean.file.fileDownloadCheck({ file, user });
    }

  }

  return File;
};
