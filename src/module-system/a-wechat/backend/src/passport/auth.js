const require3 = require('require3');
const strategy = require3('@zhennann/passport-wechat').Strategy;
const WechatHelperFn = require('../common/wechatHelper.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const providerName = 'wechat';
  return {
    providers: {
      [providerName]: {
        meta: {
          title: 'Wechat Public',
          mode: 'redirect',
          component: 'button',
        },
        config: {
          appID: '',
          appSecret: '',
          client: 'wechat',
          scope: 'snsapi_userinfo',
        },
        configFunctions: {
          getConfig(ctx) {
            const config = ctx.config.module(moduleInfo.relativeName).account.public;
            return { appID: config.appID, appSecret: config.appSecret };
          },
          // getToken(ctx, openid, cb) {
          //   const name = `wechat-public:${openid}`;
          //   ctx.cache.db.module(moduleInfo.relativeName).get(name)
          //     .then(token => {
          //       cb(null, token);
          //     })
          //     .catch(cb);
          // },
          // saveToken(ctx, openid, token, cb) {
          //   const name = `wechat-public:${openid}`;
          //   ctx.cache.db.module(moduleInfo.relativeName).set(name, token, (token.expires_in - 10) * 1000)
          //     .then(() => {
          //       cb(null);
          //     })
          //     .catch(cb);
          // },
        },
        handler: app => {
          return {
            strategy,
            callback: (req, accessToken, refreshToken, userInfo, expires_in, done) => {
              const wechatHelper = new (WechatHelperFn(req.ctx))();
              wechatHelper.verifyAuthUser({
                openid: userInfo.openid,
                userInfo,
                cbVerify: (profileUser, cb) => {
                  app.passport.doVerify(req, profileUser, cb);
                },
              }).then(verifyUser => { done(null, verifyUser); }).catch(done);
            },
          };
        },
      },
    },
  };
};
