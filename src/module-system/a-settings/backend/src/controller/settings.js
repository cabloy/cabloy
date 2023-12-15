module.exports = class SettingsController {
  // instance

  instanceList() {
    const res = this.ctx.service.settings.instanceList();
    this.ctx.successMore(res, 0, -1);
  }

  async instanceLoad() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.settings.instanceLoad(this.ctx.request.body);
    this.ctx.success(res);
  }

  async instanceSave() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.settings.instanceSave(this.ctx.request.body);
    this.ctx.success(res);
  }

  // user

  userList() {
    const res = this.ctx.service.settings.userList();
    this.ctx.successMore(res, 0, -1);
  }

  async userLoad() {
    const res = await this.ctx.service.settings.userLoad(this.ctx.request.body);
    this.ctx.success(res);
  }

  async userSave() {
    const res = await this.ctx.service.settings.userSave(this.ctx.request.body);
    this.ctx.success(res);
  }
};
