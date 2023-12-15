module.exports = class SettingsController {
  // instance

  instanceList() {
    const res = this.service.settings.instanceList();
    this.ctx.successMore(res, 0, -1);
  }

  async instanceLoad() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.settings.instanceLoad(this.ctx.request.body);
    this.ctx.success(res);
  }

  async instanceSave() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.settings.instanceSave(this.ctx.request.body);
    this.ctx.success(res);
  }

  // user

  userList() {
    const res = this.service.settings.userList();
    this.ctx.successMore(res, 0, -1);
  }

  async userLoad() {
    const res = await this.service.settings.userLoad(this.ctx.request.body);
    this.ctx.success(res);
  }

  async userSave() {
    const res = await this.service.settings.userSave(this.ctx.request.body);
    this.ctx.success(res);
  }
};
