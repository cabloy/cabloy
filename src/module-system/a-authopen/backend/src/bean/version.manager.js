const VersionUpdate1 = require('./version/update1.js');
const VersionInit1 = require('./version/init1.js');

module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      const versionUpdate1 = new VersionUpdate1();
      await versionUpdate1.run();
    }
  }

  async init(options) {
    if (options.version === 1) {
      const versionInit1 = new VersionInit1();
      await versionInit1.run(options);
    }
  }

  async test() {}
};
