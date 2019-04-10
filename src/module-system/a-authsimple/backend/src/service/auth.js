const util = require('util');
const passwordFn = require('password-hash-and-salt');
module.exports = app => {
  class Auth extends app.Service {

    async signup({ userName, realName, email, mobile, password }) {
      const userId = await this.ctx.meta.user.signup({ userName, realName, email, mobile });
      await this.add({ userId, password });
      return userId;
    }

    async signin({ auth, password, rememberMe }) {
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

    async add({ userId, password }) {
      password = password || this.ctx.config.defaultPassword;
      const hash = await this._calcPassword({ password });
      // auth simple
      await this.ctx.model.authSimple.insert({
        userId,
        hash,
      });
      // auth
      const info = this.ctx.module.info;
      const providerItem = await this.ctx.meta.user.getAuthProvider({
        module: info.relativeName,
        providerName: info.name,
      });
      await this.ctx.model.auth.insert({
        userId,
        providerId: providerItem.id,
        profileId: userId,
        profile: JSON.stringify({
          userId,
          rememberMe: false,
        }),
      });
    }

    async verify({ userId, password }) {
      if (!password) return false;
      const auth = await this.ctx.model.authSimple.get({
        userId,
      });
      if (!auth) return false;
      return await this._verifyPassword({ password, hash: auth.hash });
    }

    async reset({ passwordOld, passwordNew, userId }) {
      // verify old
      const res = await this.verify({ userId, password: passwordOld });
      if (!res) this.ctx.throw(403);
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
