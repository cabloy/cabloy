const Strategy = require('passport-github').Strategy;
const StrategyMock = require('../meta/passport/strategyMock.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    async getConfigDefault() {
      const configGitHub = this.configModule.account.github;
      return {
        scenes: configGitHub.scenes,
      };
    }
    checkConfigValid(config) {
      return this.allowStrategyMock || (!!config.clientID && !!config.clientSecret);
    }
    getStrategy() {
      return this.allowStrategyMock ? StrategyMock : Strategy;
    }
    async onVerify(accessToken, refreshToken, profile) {
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: profile.id,
        profile: {
          userName: profile.username,
          realName: profile.displayName,
          avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
          accessToken,
          refreshToken,
          profile,
        },
      };
    }
  }

  return Provider;
};
