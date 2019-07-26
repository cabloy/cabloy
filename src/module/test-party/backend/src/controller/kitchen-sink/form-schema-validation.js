module.exports = app => {

  class FormSchemaValidationController extends app.Controller {

    async load() {
      // try load from db cache
      const cacheName = this._getCacheName();
      let item = await this.ctx.cache.db.get(cacheName);
      if (!item) {
        item = {
          userName: '',
          password: '',
          passwordAgain: '',
          sex: 0,
          language: '',
          avatar: '',
          rememberMe: false,
        };
      }
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

    _getCacheName() {
      // get the operation user
      const user = this.ctx.user.op;
      return `__formTest:${user.id}`;
    }

  }

  return FormSchemaValidationController;
};

