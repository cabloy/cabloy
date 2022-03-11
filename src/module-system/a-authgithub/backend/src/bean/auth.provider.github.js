module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider {
    getConfig() {
      const config = ctx.config.module(moduleInfo.relativeName).account.github.apps.default;
      return { clientID: config.clientID, clientSecret: config.clientSecret };
    }
  }

  return Provider;
};
