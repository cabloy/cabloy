const QRCode = require('qrcode-svg');

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

    atomClasses() {
      const res = this.ctx.service.base.atomClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }

    flags() {
      const res = this.ctx.service.base.flags();
      this.ctx.success(res);
    }

    orders() {
      const res = this.ctx.service.base.orders();
      this.ctx.success(res);
    }

    menus() {
      const res = this.ctx.service.base.menus();
      this.ctx.success(res);
    }

    functions() {
      const res = this.ctx.service.base.functions();
      this.ctx.success(res);
    }

    async performAction() {
      // params
      const params = JSON.parse(this.ctx.request.query.params);
      // performAction
      const res = await this.ctx.performAction(params);
      this.ctx.success(res);
    }

    async qrcode() {
      const query = this.ctx.request.query;
      const qrcode = new QRCode({
        content: query.content || 'CabloyJS',
        padding: parseInt(query.padding || '4'),
        width: parseInt(query.width || '256'),
        height: parseInt(query.height || '256'),
        color: query.color || '#000000',
        background: query.background || '#ffffff',
        ecl: query.ecl || 'M',
      });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/svg';
      this.ctx.body = qrcode.svg();
    }

  }

  return BaseController;
};
