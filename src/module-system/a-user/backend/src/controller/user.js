module.exports = class UserController {
  async save() {
    const res = await this.ctx.service.user.save({
      data: this.ctx.request.body.data,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async saveAvatar() {
    const res = await this.ctx.service.user.saveAvatar({
      data: this.ctx.request.body.data,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async saveLocale() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.saveLocale({
      data: this.ctx.request.body.data,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async changeUserName() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.changeUserName({
      data: this.ctx.request.body.data,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async agent() {
    const res = await this.ctx.service.user.agent({ userId: this.ctx.state.user.agent.id });
    this.ctx.success(res);
  }

  async agentsBy() {
    const res = await this.ctx.service.user.agentsBy({ userId: this.ctx.state.user.agent.id });
    this.ctx.success(res);
  }

  async userByMobile() {
    const res = await this.ctx.service.user.userByMobile({ mobile: this.ctx.request.body.mobile });
    this.ctx.success(res);
  }

  async addAgent() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.addAgent({
      userIdAgent: this.ctx.request.body.userIdAgent,
      userId: this.ctx.state.user.agent.id,
    });
    this.ctx.success(res);
  }

  async removeAgent() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.removeAgent({
      userIdAgent: this.ctx.request.body.userIdAgent,
      userId: this.ctx.state.user.agent.id,
    });
    this.ctx.success(res);
  }

  async switchAgent() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.switchAgent({
      userIdAgent: this.ctx.request.body.userIdAgent,
    });
    this.ctx.success(res);
  }

  async switchOffAgent() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.switchOffAgent();
    this.ctx.success(res);
  }

  async authentications() {
    const res = await this.ctx.service.user.authentications({
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async authenticationDisable() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.user.authenticationDisable({
      authId: this.ctx.request.body.authId,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async themeLoad() {
    const res = await this.ctx.service.user.themeLoad({
      appKey: this.ctx.request.body.appKey,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success(res);
  }

  async themeSave() {
    await this.ctx.service.user.themeSave({
      appKey: this.ctx.request.body.appKey,
      theme: this.ctx.request.body.theme,
      user: this.ctx.state.user.agent,
    });
    this.ctx.success();
  }
};
