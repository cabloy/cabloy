const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class File {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's file
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // get root path
    async getRootPath() {
      if (ctx.app.meta.isTest || ctx.app.meta.isLocal) {
        return ctx.app.config.static.dir;
      }
      const dir = ctx.config.module(moduleInfo.relativeName).publicDir || path.join(require('os').homedir(), 'cabloy', ctx.app.name, 'public');
      await fse.ensureDir(dir);
      return dir;
    }

    // get path
    async getPath(subdir, ensure) {
      const rootPath = await this.getRootPath();
      const dir = path.join(rootPath, ctx.instance.id.toString(), subdir || '');
      if (ensure) {
        await fse.ensureDir(dir);
      }
      return dir;
    }

    // get url
    getUrl(path) {
      const prefix = ctx.host ? `${ctx.protocol}://${ctx.host}` : '';
      return `${prefix}${path}`;
    }

    // get forward url
    getForwardUrl(path) {
      const prefix = (ctx.app.meta.isTest || ctx.app.meta.isLocal) ? ctx.app.config.static.prefix : '/public/';
      return `${prefix}${ctx.instance.id}/${path}`;
    }

  }

  return File;
};
