const strategy = require('./strategy-wxwork.js');
const WxworkHelperFn = require('../common/wxworkHelper.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const providerName = 'wxwork';
  const providerNameMini = 'wxworkMini';
  return {
    providers: {
      [providerName]: {
        meta: {
          title: 'Wechat Work',
          mode: 'redirect',
          component: 'button',
        },
        config: {
          corpid: '',
          agentid: '',
          client: 'wxwork',
          scope: 'snsapi_base',
        },
        configFunctions: {
          getConfig(ctx) {
            const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
            return { corpid: config.corpid, agentid: config.apps.selfBuilt.agentid };
          },
        },
        handler: app => {
          return {
            strategy,
            callback: (req, code, done) => {
              const ctx = req.ctx;
              const state = ctx.request.query.state || 'login';
              const wxworkHelper = new (WxworkHelperFn(ctx))();
              wxworkHelper.verifyAuthUser({
                scene: 1,
                code,
                state,
                cbVerify: (profileUser, cb) => {
                  app.passport.doVerify(req, profileUser, cb);
                },
              }).then(verifyUser => { done(null, verifyUser); }).catch(done);
            },
          };
        },
      },
      [providerNameMini]: {
        meta: {
          title: 'Wechat Work Miniprogram',
          mode: 'direct',
        },
        config: {
        },
        handler: null,
      },
    },
  };
};
