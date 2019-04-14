const strategy = require('./strategy.js');
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  async function verify(ctx, body) {
    const { auth, password, rememberMe } = body;
    // validate
    await ctx.meta.validation.validate({ validator: 'signin', data: body });
    // exists
    const user = await ctx.meta.user.exists({ userName: auth, email: auth, mobile: auth });
    if (!user) return ctx.throw(1001);
    // disabled
    if (user.disabled) return ctx.throw(1002);
    // verify
    const verify = await ctx.service.auth.verify({ userId: user.id, password });
    if (!verify) return ctx.throw(1001);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: user.id,
      maxAge: rememberMe ? null : 0,
      profile: {
        userId: user.id,
        rememberMe,
      },
    };
  }
  return {
    providers: {
      [provider]: {
        config: {
          successReturnToOrRedirect: false,
          successRedirect: false,
          innerAccess: true,
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
