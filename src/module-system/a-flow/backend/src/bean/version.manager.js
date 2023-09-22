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
