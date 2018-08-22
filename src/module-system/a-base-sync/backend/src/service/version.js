const VersionUpdate1Fn = require('./version/update1.js');
const VersionUpdate2Fn = require('./version/update2.js');
const VersionUpdate3Fn = require('./version/update3.js');
const VersionInitFn = require('./version/init.js');

module.exports = app => {

  class Version extends app.Service {

    async update(options) {

      if (options.version === 3) {
        const versionUpdate3 = new (VersionUpdate3Fn(this.ctx))();
        await versionUpdate3.run();
      }

      if (options.version === 2) {
        const versionUpdate2 = new (VersionUpdate2Fn(this.ctx))();
        await versionUpdate2.run();
      }

      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }
    }

    async init(options) {
      if (options.version === 2) {
        const versionInit = new (VersionInitFn(this.ctx))();
        await versionInit.run(options);
      }
    }

  }

  return Version;
};
