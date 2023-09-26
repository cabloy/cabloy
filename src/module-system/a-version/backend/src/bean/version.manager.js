const fse = require('fs-extra');

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // do nothing
      }

      if (options.version === 2) {
        await this.ctx.db.query(`
          CREATE TABLE aVersionInit (
            id INT NOT NULL AUTO_INCREMENT,
            subdomain VARCHAR(50) NULL,
            module VARCHAR(50) NULL,
            version INT NULL,
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id));
          `);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // remove publicDir
        await this._removePublicDir();
      }
    }

    async _removePublicDir() {
      // only for test/local env
      if (app.meta.isProd) return;
      // path
      const publicPath = await this.ctx.bean.base.getPath();
      // remove
      await fse.remove(publicPath);
    }
  }

  return Version;
};
