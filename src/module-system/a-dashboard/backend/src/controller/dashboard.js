module.exports = app => {
  class ProfileController extends app.Controller {

    async itemByKey() {
      const res = await this.service.dashboard.itemByKey({
        atomStaticKey: this.ctx.request.body.key.atomStaticKey,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async item() {
      const res = await this.service.dashboard.item({
        dashboardAtomId: this.ctx.request.body.key.atomId,
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

    // //////////

    async list() {
      const res = await this.service.profile.list({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async create() {
      const profileId = await this.service.profile.create({
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.op,
      });
      this.ctx.success({ profileId });
    }


    async delete() {
      const res = await this.service.profile.delete({
        profileId: this.ctx.request.body.profileId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async save() {
      const res = await this.service.profile.save({
        profileId: this.ctx.request.body.profileId,
        profileValue: this.ctx.request.body.profileValue,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return ProfileController;
};
