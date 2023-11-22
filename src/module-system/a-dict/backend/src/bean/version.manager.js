const fileVersionUpdates = [1, 3];
const fileVersionInits = [1, 2];

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (fileVersionUpdates.includes(options.version)) {
        const VersionUpdateFn = require(`./version.manager/update/update${options.version}.js`);
        const versionUpdate = new (VersionUpdateFn(this.ctx))();
        await versionUpdate.run(options);
      }
    }

    async init(options) {
      if (fileVersionInits.includes(options.version)) {
        const VersionInitFn = require(`./version.manager/init/init${options.version}.js`);
        const versionInit = new (VersionInitFn(this.ctx))();
        await versionInit.run(options);
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
