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
    const authSimple = await ctx.service.auth.verify({ userId: user.id, password });
    if (!authSimple) return ctx.throw(1001);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: authSimple.id,
      maxAge: rememberMe ? null : 0,
      profile: {
        authSimpleId: authSimple.id,
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
