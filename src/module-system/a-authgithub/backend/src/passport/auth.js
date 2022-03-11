const require3 = require('require3');
const strategy = require3('passport-github').Strategy;
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider() {
    return {
      meta: {
        title: 'GitHub',
        mode: 'redirect',
        bean: {
          module: moduleInfo.relativeName,
          name: 'github',
        },
        render: {
          module: moduleInfo.relativeName,
          name: 'buttonGithub',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'authGithub',
        },
      },
      config: {},
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.github.apps.default;
          return { clientID: config.clientID, clientSecret: config.clientSecret };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, accessToken, refreshToken, params, profile, done) => {
            const user = {
              module: moduleInfo.relativeName,
              provider: 'authgithub',
              profileId: profile.id,
              profile: {
                userName: profile.username,
                realName: profile.displayName,
                avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
                accessToken,
                refreshToken,
                params,
                profile,
              },
            };
            app.passport.doVerify(req, user, done);
          },
        };
      },
    };
  }

  const metaAuth = {
    providers: {
      authgithub: _createProvider(),
    },
  };

  // ok
  return metaAuth;
};
