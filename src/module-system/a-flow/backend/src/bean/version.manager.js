module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      const fileVersions = [1, 2, 3, 5];
      if (fileVersions.includes(options.version)) {
        const VersionUpdateFn = require(`./version.manager/update/update${options.version}.js`);
        const versionUpdate = new (VersionUpdateFn(this.ctx))();
        await versionUpdate.run();
      }
    }

    async init(options) {
      const fileVersions = [1, 4];
      if (fileVersions.includes(options.version)) {
        const VersionInitFn = require(`./version.manager/init/init${options.version}.js`);
        const versionInit = new (VersionInitFn(this.ctx))();
        await versionInit.run();
      }
    }

    async test() {
      const VersionTestFn = require('./version.manager/test/test.js');
      const versionTest = new (VersionTestFn(this.ctx))();
      await versionTest.run();
    }
  }

  return Version;
};
