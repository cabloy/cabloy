module.exports = class DashboardController {
  async itemByKey() {
    const res = await this.service.dashboard.itemByKey({
      atomStaticKey: this.ctx.request.body.atomStaticKey,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async item() {
    const res = await this.service.dashboard.item({
      dashboardAtomId: this.ctx.request.body.key.atomId,
      dashboardUserCheck: this.ctx.request.body.dashboardUserCheck,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async loadItemUser() {
    const res = await this.service.dashboard.loadItemUser({
      dashboardUserId: this.ctx.request.body.dashboardUserId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async saveItemUser() {
    const res = await this.service.dashboard.saveItemUser({
      dashboardUserId: this.ctx.request.body.dashboardUserId,
      content: this.ctx.request.body.content,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async changeItemUserName() {
    const res = await this.service.dashboard.changeItemUserName({
      dashboardUserId: this.ctx.request.body.dashboardUserId,
      dashboardName: this.ctx.request.body.dashboardName,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async deleteItemUser() {
    const res = await this.service.dashboard.deleteItemUser({
      dashboardUserId: this.ctx.request.body.dashboardUserId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async createItemUser() {
    const res = await this.service.dashboard.createItemUser({
      dashboardAtomId: this.ctx.request.body.key.atomId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async itemUsers() {
    const res = await this.service.dashboard.itemUsers({
      dashboardAtomId: this.ctx.request.body.key.atomId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async changeItemUserDefault() {
    const res = await this.service.dashboard.changeItemUserDefault({
      dashboardAtomId: this.ctx.request.body.key.atomId,
      dashboardUserId: this.ctx.request.body.dashboardUserId,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
};
