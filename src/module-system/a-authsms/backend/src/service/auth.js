module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {

    async signup({ user, state = 'login', userName, realName, mobile }) {

      // profileUser
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: 'authsms',
        profileId: mobile,
        maxAge: 0,
        profile: {
          mobile,
          rememberMe: false,
        },
      };

      // verify
      const verifyUser = await this.ctx.meta.user.verify({ state, profileUser });
      if (!verifyUser) this.ctx.throw(403);

      // userId
      const userId = verifyUser.agent.id;

      // override user's info: userName/realName/mobile
      const userNew = { id: userId, realName };
      if (state === 'login' || !user.userName || user.userName.indexOf('__') > -1) {
        userNew.userName = userName;
      }
      await this.ctx.meta.user.save({
        user: userNew,
      });
      // save mobile
      await this.ctx.meta.user.setActivated({
        user: { id: userId, mobile, mobileVerified: 1 },
      });

      // login now
      //   always no matter login/associate
      await this.ctx.login(verifyUser);

      // ok
      return verifyUser;
    }

    async signin({ mobile, rememberMe }) {
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'passport/a-authsms/authsms',
        body: { mobile, rememberMe },
      });
      return res;
    }

    async mobileVerify({ user, mobile }) {
      // save mobile
      await this.ctx.meta.user.setActivated({
        user: { id: user.id, mobile, mobileVerified: 1 },
      });
    }

  }

  return Auth;
};
