module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {

    // email: not use
    async signup({ user, state = 'login', userName, realName, email, mobile, password }) {

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
      const verifyUser = await this.ctx.meta.user.verify({ state, profileUser });
      if (!verifyUser) this.ctx.throw(403);

      // userId
      const userId = verifyUser.agent.id;
      // remove old records
      await this.ctx.model.authSimple.delete({ userId });
      // update userId
      await this.ctx.model.authSimple.update({ id: authSimpleId, userId });

      // override user's info: userName/realName/email
      const userNew = { id: userId, realName };
      if (state === 'login' || !user.userName || user.userName.indexOf('__') > -1) {
        userNew.userName = userName;
      }
      await this.ctx.meta.user.save({
        user: userNew,
      });
      // save email
      if (email !== verifyUser.agent.email) {
        await this.ctx.meta.user.setActivated({
          user: { id: userId, email, emailConfirmed: 0 },
        });
      }

      // login now
      //   always no matter login/associate
      await this.ctx.login(verifyUser);

      // ok
      return verifyUser;
    }

    async signin({ mobile, rememberMe }) {
      try {
        const res = await this.ctx.performAction({
          method: 'post',
          url: 'passport/a-authsimple/authsimple',
          body: { auth, password, rememberMe },
        });
        return res;
      } catch (err) {
        const error = new Error();
        error.code = err.code;
        error.message = err.message;
        throw error;
      }
    }

  }

  return Auth;
};
