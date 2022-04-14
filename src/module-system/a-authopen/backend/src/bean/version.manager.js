const VersionUpdate1Fn = require('./version/update1.js');
const VersionInit1Fn = require('./version/init1.js');

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }
    }

    async init(options) {
      if (options.version === 1) {
        const versionInit1 = new (VersionInit1Fn(this.ctx))();
        await versionInit1.run(options);
      }
    }

    async test() {}
  }

  return Version;
};
