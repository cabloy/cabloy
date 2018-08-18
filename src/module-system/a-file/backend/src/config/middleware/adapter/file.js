const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');

const Fn = module.exports = ctx => {

  class File {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's file
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // get Path
    async getPath(subdir, ensure = true) {
      const dir = path.join(ctx.app.config.static.dir, ctx.instance.id.toString(), subdir || '');
      if (ensure) {
        await fse.ensureDir(dir);
      }
      return dir;
    }

  }

  return File;
};
