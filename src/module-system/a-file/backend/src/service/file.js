module.exports =
  // const moduleInfo = module.info;
  class File {
    async all({ atomClass, options, user }) {
      return await this.ctx.bean.file.all({ atomClass, options, user });
    }

    // where adjusted by controller
    async list({ key, options, user }) {
      return await this.ctx.bean.file.list({ key, options, user });
    }

    async delete({ fileId, user }) {
      return await this.ctx.bean.file.delete({ fileId, user });
    }

    async update({ fileId, data, user }) {
      return await this.ctx.bean.file.update({ fileId, data, user });
    }

    async upload({ user }) {
      return await this.ctx.bean.file.upload({ user });
    }

    async uploadDataUrl({ data, user }) {
      return await this.ctx.bean.file.uploadDataUrl({ data, user });
    }

    async download({ downloadId, atomId, width, height, user }) {
      return await this.ctx.bean.file.download({ downloadId, atomId, width, height, user });
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
  };
