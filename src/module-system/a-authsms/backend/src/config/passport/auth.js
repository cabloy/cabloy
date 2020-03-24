const strategy = require('./strategy.js');
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  async function verify(ctx, body) {
    const { mobile, rememberMe } = body;
    // validate
    await ctx.meta.validation.validate({ validator: 'signin', data: body });
    // exists
    const user = await ctx.meta.user.exists({ mobile });
    if (!user) return ctx.throw(1004);
    // disabled
    if (user.disabled) return ctx.throw(1005);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: mobile,
      maxAge: rememberMe ? null : 0,
      authShouldExists: true,
      profile: {
        mobile,
        rememberMe,
      },
    };
  }
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'SMS',
          mode: 'direct',
          component: 'signin',
        },
        config: {
        },
        handler: app => {
          return {
            strategy,
            callback: (req, body, done) => {
              verify(req.ctx, body).then(user => {
                app.passport.doVerify(req, user, done);
              }).catch(err => { done(err); });
            },
          };
        },
      },
    },
  };
};
