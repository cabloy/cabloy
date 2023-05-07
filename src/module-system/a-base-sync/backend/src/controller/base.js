const require3 = require('require3');
const qr = require3('qr-image');

module.exports = app => {
  class BaseController extends app.Controller {
    modules() {
      const res = this.ctx.service.base.modules();
      this.ctx.success(res);
    }

    locales() {
      const res = this.ctx.service.base.locales();
      this.ctx.success(res);
    }

    resourceTypes() {
      const res = this.ctx.service.base.resourceTypes();
      this.ctx.success(res);
    }

    async getAtomClassBase() {
      const res = await this.ctx.service.base.getAtomClassBase({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

    getActionsBase() {
      const res = this.ctx.service.base.getActionsBase({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

    atomClasses() {
      const res = this.ctx.service.base.atomClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }

    themes() {
      const res = this.ctx.service.base.themes();
      this.ctx.success(res);
    }

    async qrcode() {
      const query = this.ctx.request.query;
      const img = qr.image(query.text || '', {
        type: query.type || 'png',
        size: query.size || 10,
        margin: query.margin || 4,
        ec_level: query.ec_level || 'M',
      });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/png';
      this.ctx.body = img;
    }
  }

  return BaseController;
};
