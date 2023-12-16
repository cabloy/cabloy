const moduleInfo = module.info;

module.exports = class AuthSimple {
  get modelAuthSimple() {
    return ctx.model.module(moduleInfo.relativeName).authSimple;
  }
  get modelAuth() {
    return ctx.model.module('a-base').auth;
  }
  get localSimple() {
    return ctx.bean.local.module(moduleInfo.relativeName).simple;
  }
  get configModule() {
    return ctx.config.module(moduleInfo.relativeName);
  }
  get cacheDb() {
    return ctx.cache.db.module(moduleInfo.relativeName);
  }

  // mobile: not use
  async signup({ user, state = 'login', userName, realName, email, /* mobile,*/ password }) {
    // add authsimple
    const authSimpleId = await this._addAuthSimple({ password });

    // profileUser
    const profileUser = {
      module: moduleInfo.relativeName,
      provider: 'authsimple',
      profileId: authSimpleId,
      maxAge: 0,
      profile: {
        authSimpleId,
        rememberMe: false,
      },
    };

    // verify
    const verifyUser = await ctx.bean.user.verify({ state, profileUser });
    if (!verifyUser) ctx.throw(403);

    // userId
    const userId = verifyUser.agent.id;
    // remove old records
    await this.modelAuthSimple.delete({ userId });
    // update userId
    await this.modelAuthSimple.update({ id: authSimpleId, userId });

    // override user's info: userName/realName/email
    const userNew = { id: userId, realName };
    if (state === 'login' || !user.userName || user.userName.indexOf('__') > -1) {
      userNew.userName = userName;
    }
    await ctx.bean.user.save({
      user: userNew,
    });
    // save email
    if (email !== verifyUser.agent.email) {
      await ctx.bean.user.setActivated({
        user: { id: userId, email, emailConfirmed: 0 },
      });
    }

    // login now
    //   always no matter login/associate
    await ctx.bean.auth.login(verifyUser);

    // ok
    return verifyUser;
  }

  // data: { auth, password, rememberMe }
  async signin({ data, state = 'login' }) {
    const res = await ctx.bean.authProvider.authenticateDirect({
      module: moduleInfo.relativeName,
      providerName: 'authsimple',
      query: { state },
      body: { data },
    });
    // const res = await ctx.meta.util.performAction({
    //   method: 'post',
    //   url: `/a/auth/passport/a-authsimple/authsimple?state=${state}`,
    //   body: { data },
    // });
    return res;
  }

  async signinDirect({ data, state = 'login' }) {
    // beanProvider
    const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
      module: moduleInfo.relativeName,
      providerName: 'authsimple',
      providerScene: null,
    });
    // profileUser
    const profileUser = await this.ensureAuthUser({ beanProvider, data });
    // verifyUser
    const verifyUser = await ctx.bean.user.verify({ state, profileUser });
    if (!verifyUser) ctx.throw(403);
    // login
    await ctx.bean.auth.login(verifyUser);
    // ok
    return verifyUser;
  }

  async _addAuthSimple({ password }) {
    // hash
    password = password || this.configModule.defaultPassword;
    const hash = await this.localSimple.calcPassword({ password });
    // auth simple
    const res = await this.modelAuthSimple.insert({
      userId: 0,
      hash,
    });
    return res.insertId;
  }

  async add({ userId, password }) {
    // add authsimple
    const authSimpleId = await this._addAuthSimple({ password });
    // update userId
    await this.modelAuthSimple.update({ id: authSimpleId, userId });

    // auth
    const providerItem = await ctx.bean.authProvider.getAuthProvider({
      module: moduleInfo.relativeName,
      providerName: 'authsimple',
    });
    await this.modelAuth.insert({
      userId,
      providerId: providerItem.id,
      profileId: authSimpleId,
      profile: JSON.stringify({
        authSimpleId,
        rememberMe: false,
      }),
    });
    return authSimpleId;
  }

  async passwordChange({ passwordOld, passwordNew, userId }) {
    let authSimpleId;
    // check if exists
    const authSimple = await this.modelAuthSimple.get({ userId });
    if (!authSimple) {
      // create a new one
      authSimpleId = await this.add({ userId, password: passwordNew });
    } else {
      // verify old one
      const authSimple = await this.localSimple.verify({ userId, password: passwordOld });
      if (!authSimple) ctx.throw(403);
      authSimpleId = authSimple.id;
    }

    // save new
    await this._passwordSaveNew({ passwordNew, userId });

    // profileUser
    const profileUser = {
      module: moduleInfo.relativeName,
      provider: 'authsimple',
      profileId: authSimpleId,
      maxAge: 0,
      profile: {
        authSimpleId,
        rememberMe: false,
      },
    };

    // verify
    const verifyUser = await ctx.bean.user.verify({ state: 'associate', profileUser });
    if (!verifyUser) ctx.throw(403);

    // force kickout all login records
    await ctx.bean.userOnline.kickOut({ user: { id: userId } });

    // login now
    //   always no matter login/associate
    // await ctx.bean.auth.login(verifyUser);
  }

  async _passwordSaveNew({ passwordNew, userId }) {
    // save new
    const auth = await this.modelAuthSimple.get({
      userId,
    });
    const hash = await this.localSimple.calcPassword({ password: passwordNew });
    await this.modelAuthSimple.update({
      id: auth.id,
      hash,
    });
  }

  async passwordReset({ passwordNew, token }) {
    // token value
    const cacheKey = `passwordReset:${token}`;
    const value = await this.cacheDb.get(cacheKey);
    if (!value) {
      // expired, send confirmation mail again
      //  1003: passwordResetEmailExpired
      ctx.throw.module(moduleInfo.relativeName, 1003);
    }
    // userId
    const userId = value.userId;

    // check if exists
    const authSimple = await this.modelAuthSimple.get({ userId });
    if (!authSimple) {
      // create a new one
      await this.add({ userId, password: passwordNew });
    } else {
      // save new
      await this._passwordSaveNew({ passwordNew, userId });
    }
    // clear token
    await this.cacheDb.remove(cacheKey);
    // login antomatically
    const user = await ctx.bean.user.get({ id: userId });
    const data = { auth: user.email, password: passwordNew, rememberMe: false };
    const user2 = await this.signin({ data, state: 'login' });
    // ok
    return user2;
  }

  async passwordForgot({ email }) {
    // user by email
    const user = await ctx.bean.user.exists({ email });
    // link
    const token = ctx.bean.util.uuidv4();
    const link = ctx.bean.base.getAbsoluteUrl(`/#!/a/authsimple/passwordReset?token=${token}`);
    // config
    const configTemplate = this.configModule.email.templates.passwordReset;
    // email subject
    let subject = ctx.text(configTemplate.subject);
    subject = ctx.bean.util.replaceTemplate(subject, { siteName: ctx.instance.title });
    // email body
    let body = ctx.text(configTemplate.body);
    body = ctx.bean.util.replaceTemplate(body, {
      userName: user.userName,
      link,
      siteName: ctx.instance.title,
    });
    // send
    await ctx.bean.mail.send({
      scene: null, // use default
      message: {
        to: email,
        subject,
        text: body,
      },
    });
    // save
    await this.cacheDb.set(`passwordReset:${token}`, { userId: user.id }, this.configModule.passwordReset.timeout);
  }

  async emailConfirm({ email, user }) {
    // save email
    await ctx.bean.user.setActivated({
      user: { id: user.id, email, emailConfirmed: 0 },
    });
    // link
    const token = ctx.bean.util.uuidv4();
    const link = ctx.bean.base.getAbsoluteUrl(`/api/a/authsimple/auth/emailConfirmation?token=${token}`);
    // config
    const configTemplate = this.configModule.email.templates.confirmation;
    // email subject
    let subject = ctx.text(configTemplate.subject);
    subject = ctx.bean.util.replaceTemplate(subject, { siteName: ctx.instance.title });
    // email body
    let body = ctx.text(configTemplate.body);
    body = ctx.bean.util.replaceTemplate(body, {
      userName: user.userName,
      link,
      siteName: ctx.instance.title,
    });
    // send
    await ctx.bean.mail.send({
      scene: null, // use default
      message: {
        to: email,
        subject,
        text: body,
      },
    });
    // save
    await this.cacheDb.set(`emailConfirm:${token}`, { userId: user.id }, this.configModule.confirmation.timeout);
  }

  // invoke by user clicking the link
  async emailConfirmation({ token }) {
    // token value
    const cacheKey = `emailConfirm:${token}`;
    const value = await this.cacheDb.get(cacheKey);
    if (!value) {
      // expired, send confirmation mail again
      const data = {
        message: ctx.text('confirmationEmailExpired'),
        link: '/a/authsimple/emailConfirm',
        linkText: ctx.text('Resend Confirmation Email'),
      };
      const url = ctx.bean.base.getAlertUrl({ data });
      return ctx.redirect(url);
    }
    // userId
    const userId = value.userId;
    // activated
    await ctx.bean.user.setActivated({
      user: { id: userId, emailConfirmed: 1 },
    });
    // clear token
    await this.cacheDb.remove(cacheKey);
    // not: login antomatically
    // ok
    const data = {
      message: ctx.text('confirmationEmailSucceeded'),
      link: '#back',
      linkText: ctx.text('Close'),
    };
    const url = ctx.bean.base.getAlertUrl({ data });
    return ctx.redirect(url);
  }

  async checkStatus({ user }) {
    // check if exists
    const auth = await this.modelAuthSimple.get({
      userId: user.id,
    });
    return {
      exists: !!auth,
    };
  }

  async ensureAuthUser({ beanProvider, data: { auth, password, rememberMe } }) {
    // exists
    const user = await ctx.bean.user.exists({ userName: auth, email: auth, mobile: auth });
    if (!user) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // disabled
    if (user.disabled) return ctx.throw.module(moduleInfo.relativeName, 1002);
    // verify
    const authSimple = await this.localSimple.verify({ userId: user.id, password });
    if (!authSimple) return ctx.throw.module(moduleInfo.relativeName, 1001);
    return {
      module: beanProvider.providerModule,
      provider: beanProvider.providerName,
      providerScene: beanProvider.providerScene,
      profileId: authSimple.id,
      maxAge: rememberMe ? null : 0,
      authShouldExists: true,
      profile: {
        authSimpleId: authSimple.id,
        rememberMe,
      },
    };
  }
};
