const fileVersionUpdates = [1];
const fileVersionInits = [1];

module.exports = class Version {
  async update(options) {
    if (fileVersionUpdates.includes(options.version)) {
      const VersionUpdate = require(`./version.manager/update/update${options.version}.js`);
      const versionUpdate = this.ctx.bean._newBean(VersionUpdate);
      await versionUpdate.run(options);
    }
  }

  async init(options) {
    if (fileVersionInits.includes(options.version)) {
      const VersionInit = require(`./version.manager/init/init${options.version}.js`);
      const versionInit = this.ctx.bean._newBean(VersionInit);
      await versionInit.run(options);
    }
  }

  async test() {
    const VersionTest = require('./version.manager/test/test.js');
    const versionTest = this.ctx.bean._newBean(VersionTest);
    await versionTest.run();
  }
};
