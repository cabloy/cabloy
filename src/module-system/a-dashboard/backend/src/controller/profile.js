module.exports = app => {
  class ProfileController extends app.Controller {

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

    async item() {
      const res = await this.service.profile.item({
        profileId: this.ctx.request.body.profileId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
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
