module.exports = app => {
  class ProfileController extends app.Controller {

    async list() {
      const res = await this.service.profile.list({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async create() {
      const profileId = await this.service.profile.create({
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success({ profileId });
    }

    async item() {
      const res = await this.service.profile.item({
        profileId: this.ctx.request.body.profileId,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return ProfileController;
};
