const require3 = require('require3');
const strategy = require3('@zhennann/passport-wechat').Strategy;
const WechatHelperFn = require('../common/wechatUtils.js');

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
            // config
            const config = ctx.config.module(moduleInfo.relativeName).account.public;
            return { appID: config.appID, appSecret: config.appSecret };
          },
          getToken(ctx, openid, cb) {
            const name = `wechat-public:${openid}`;
            ctx.cache.db.module(moduleInfo.relativeName).get(name).then(token => {
              console.log('----------get:', openid, ':', token);
              cb(null, token);
            });
          },
          saveToken(ctx, openid, token, cb) {
            const name = `wechat-public:${openid}`;
            console.log('------------save:', openid, ':', token); // expires_in
            ctx.cache.db.module(moduleInfo.relativeName).set(name, token, (token.expires_in - 10) * 1000).then(() => {
              console.log('------------save:', openid, ':', token);
              cb(null);
            });
          },
        },
        handler: app => {
          return {
            strategy,
            callback: (req, accessToken, refreshToken, userInfo, expires_in, done) => {
              const wechatHelper = new (WechatHelperFn(this.ctx))();
              wechatHelper.verifyAuthUser({
                openid: userInfo.openid,
                userInfo,
                cbVerify: (profileUser, cb) => {
                  app.passport.doVerify(req, profileUser, cb);
                },
              }).then(done).catch(done);
            },
          };
        },
      },
    },
  };
};
