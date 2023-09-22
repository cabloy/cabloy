const VersionUpdate1Fn = require('./version/update/update1.js');
const VersionUpdate2Fn = require('./version/update/update2.js');
const VersionUpdate3Fn = require('./version/update/update3.js');
const VersionUpdate5Fn = require('./version/update/update5.js');
const VersionInit1Fn = require('./version/init/init1.js');
const VersionInit4Fn = require('./version/init/init4.js');

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }

      if (options.version === 2) {
        const versionUpdate2 = new (VersionUpdate2Fn(this.ctx))();
        await versionUpdate2.run();
      }

      if (options.version === 3) {
        const versionUpdate3 = new (VersionUpdate3Fn(this.ctx))();
        await versionUpdate3.run();
      }

      if (options.version === 5) {
        const versionUpdate5 = new (VersionUpdate5Fn(this.ctx))();
        await versionUpdate5.run();
      }
    }

    async init(options) {
      if (options.version === 1) {
        const versionInit1 = new (VersionInit1Fn(this.ctx))();
        await versionInit1.run(options);
      }

      if (options.version === 4) {
        const versionInit4 = new (VersionInit4Fn(this.ctx))();
        await versionInit4.run(options);
      }
    }

    async test() {
      // flowHistory
      let res = await this.ctx.model.flowHistory.insert({});
      await this.ctx.model.flowHistory.delete({ id: res.insertId });
      // flowNodeHistory
      res = await this.ctx.model.flowNodeHistory.insert({});
      await this.ctx.model.flowNodeHistory.delete({ id: res.insertId });
    }
  }

  return Version;
};
