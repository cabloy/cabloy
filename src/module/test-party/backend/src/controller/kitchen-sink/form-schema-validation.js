const require3 = require('require3');
const extend = require3('extend2');

const __ItemDefault = {
  userName: '',
  password: '',
  passwordAgain: '',
  sex: 0,
  birthday: null,
  language: '',
  avatar: '',
  rememberMe: false,
  motto: '',
};

module.exports = app => {

  class FormSchemaValidationController extends app.Controller {

    async load() {
      // try load from db cache
      const cacheName = this._getCacheName();
      let item = await this.ctx.cache.db.get(cacheName);
      item = extend(true, {}, __ItemDefault, item);
      // ok
      this.ctx.success(item);
    }

    async saveSimple() {
      // item
      const item = this.ctx.request.body.data;
      // save to db cache
      const cacheName = this._getCacheName();
      await this.ctx.cache.db.set(cacheName, item);
      // ok
      this.ctx.success();
    }

    async saveValidation() {
      await this.saveSimple();
    }

    // form-captcha signup
    signup() {
      this.ctx.success();
    }

    // form-mobile-verify
    mobileVerify() {
      this.ctx.success();
    }

    _getCacheName() {
      // get the operation user
      const user = this.ctx.state.user.op;
      return `__formTest:${user.id}`;
    }

  }

  return FormSchemaValidationController;
};

