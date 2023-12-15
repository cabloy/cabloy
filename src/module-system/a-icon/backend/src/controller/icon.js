module.exports = class iconController {
  getIcons() {
    const res = this.ctx.service.icon.getIcons();
    this.ctx.success(res);
  }
};
