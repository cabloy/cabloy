const util = require('util');
const passwordFn = require('password-hash-and-salt'); // should compile
const require3 = require('require3');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {

    // mobile: not use
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

    async signin({ auth, password, rememberMe }) {
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'passport/a-authsimple/authsimple',
        body: { auth, password, rememberMe },
      });
      return res;
    }

    async _addAuthSimple({ password }) {
      // hash
      password = password || this.ctx.config.defaultPassword;
      const hash = await this._calcPassword({ password });
      // auth simple
      const res = await this.ctx.model.authSimple.insert({
        userId: 0,
        hash,
      });
      return res.insertId;
    }

    async add({ userId, password }) {
      // add authsimple
      const authSimpleId = await this._addAuthSimple({ password });
      // update userId
      await this.ctx.model.authSimple.update({ id: authSimpleId, userId });

      // auth
      const providerItem = await this.ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authsimple',
      });
      await this.ctx.model.auth.insert({
        userId,
        providerId: providerItem.id,
        profileId: authSimpleId,
        profile: JSON.stringify({
          authSimpleId,
          rememberMe: false,
        }),
      });
    }

    async verify({ userId, password }) {
      // check
      if (!password) return false;
      // authSimple
      const authSimple = await this.ctx.model.authSimple.get({
        userId,
      });
      if (!authSimple) return false;
      // verify
      const res = await this._verifyPassword({ password, hash: authSimple.hash });
      if (!res) return false;
      // ok
      return authSimple;
    }

    async passwordChange({ passwordOld, passwordNew, userId }) {
      // verify old
      const authSimple = await this.verify({ userId, password: passwordOld });
      if (!authSimple) this.ctx.throw(403);
      // save new
      await this._passwordSaveNew({ passwordNew, userId });

      // profileUser
      const authSimpleId = authSimple.id;
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
      const verifyUser = await this.ctx.meta.user.verify({ state: 'associate', profileUser });
      if (!verifyUser) this.ctx.throw(403);
      // login now
      //   always no matter login/associate
      // await this.ctx.login(verifyUser);
    }

    async _passwordSaveNew({ passwordNew, userId }) {
      // save new
      const auth = await this.ctx.model.authSimple.get({
        userId,
      });
      const hash = await this._calcPassword({ password: passwordNew });
      await this.ctx.model.authSimple.update({
        id: auth.id,
        hash,
      });
    }

    async passwordReset({ passwordNew, token }) {
      // token value
      const cacheKey = `passwordReset:${token}`;
      const value = await this.ctx.cache.db.get(cacheKey);
      if (!value) {
        // expired, send confirmation mail again
        //  1003: passwordResetEmailExpired
        this.ctx.throw(1003);
      }
      // userId
      const userId = value.userId;

      // save new
      await this._passwordSaveNew({ passwordNew, userId });
      // clear token
      await this.ctx.cache.db.remove(cacheKey);
      // login antomatically
      const user = await this.ctx.meta.user.get({ id: userId });
      const user2 = await this.signin({ auth: user.email, password: passwordNew, rememberMe: false });
      // ok
      return user2;
    }

    async passwordForgot({ email }) {
      // user by email
      const user = await this.ctx.meta.user.exists({ email });
      // link
      const token = uuid.v4().replace(/-/g, '');
      const link = this.ctx.meta.base.getAbsoluteUrl(`/#!/a/authsimple/passwordReset?token=${token}`);
      // email scene
      const scene = (app.meta.isTest || app.meta.isLocal) ? 'test' : 'system';
      // email subject
      let subject = this.ctx.text('passwordResetEmailSubject');
      subject = this.ctx.meta.util.replaceTemplate(subject, { siteName: this.ctx.instance.title });
      // email body
      let body = this.ctx.text('passwordResetEmailBody');
      body = this.ctx.meta.util.replaceTemplate(body, {
        userName: user.userName,
        link,
        siteName: this.ctx.instance.title,
      });
      // send
      await this.ctx.meta.mail.send({
        scene,
        message: {
          to: email,
          subject,
          text: body,
        },
      });
      // save
      await this.ctx.cache.db.set(
        `passwordReset:${token}`,
        { userId: user.id },
        this.ctx.config.passwordReset.timeout
      );
    }

    async emailConfirm({ email, user }) {
      // save email
      await this.ctx.meta.user.setActivated({
        user: { id: user.id, email, emailConfirmed: 0 },
      });
      // link
      const token = uuid.v4().replace(/-/g, '');
      const link = this.ctx.meta.base.getAbsoluteUrl(`/api/a/authsimple/auth/emailConfirmation?token=${token}`);
      // email scene
      const scene = (app.meta.isTest || app.meta.isLocal) ? 'test' : 'system';
      // email subject
      let subject = this.ctx.text('confirmationEmailSubject');
      subject = this.ctx.meta.util.replaceTemplate(subject, { siteName: this.ctx.instance.title });
      // email body
      let body = this.ctx.text('confirmationEmailBody');
      body = this.ctx.meta.util.replaceTemplate(body, {
        userName: user.userName,
        link,
        siteName: this.ctx.instance.title,
      });
      // send
      await this.ctx.meta.mail.send({
        scene,
        message: {
          to: email,
          subject,
          text: body,
        },
      });
      // save
      await this.ctx.cache.db.set(
        `emailConfirm:${token}`,
        { userId: user.id },
        this.ctx.config.confirmation.timeout
      );
    }

    // invoke by user clicking the link
    async emailConfirmation({ token }) {
      // token value
      const cacheKey = `emailConfirm:${token}`;
      const value = await this.ctx.cache.db.get(cacheKey);
      if (!value) {
        // expired, send confirmation mail again
        const data = {
          message: this.ctx.text('confirmationEmailExpired'),
          link: '/a/authsimple/emailConfirm',
          linkText: this.ctx.text('Resend Confirmation Email'),
        };
        const url = this.ctx.meta.base.getAlertUrl({ data });
        return this.ctx.redirect(url);
      }
      // userId
      const userId = value.userId;
      // activated
      await this.ctx.meta.user.setActivated({
        user: { id: userId, emailConfirmed: 1 },
      });
      // clear token
      await this.ctx.cache.db.remove(cacheKey);
      // not: login antomatically
      // ok
      const data = {
        message: this.ctx.text('confirmationEmailSucceeded'),
        link: '#back',
        linkText: this.ctx.text('Close'),
      };
      const url = this.ctx.meta.base.getAlertUrl({ data });
      return this.ctx.redirect(url);
    }

    async _calcPassword({ password }) {
      const _password = passwordFn(password.toString());
      const hashFn = util.promisify(_password.hash);
      return await hashFn.call(_password);
    }

    async _verifyPassword({ password, hash }) {
      const _password = passwordFn(password.toString());
      const verifyFn = util.promisify(_password.verifyAgainst);
      return await verifyFn.call(_password, hash);
    }

  }

  return Auth;
};
