module.exports = app => {

  class Profile extends app.Service {

    async itemByKey({ atomStaticKey, user }) {
      // adjust key
      if (!atomStaticKey || atomStaticKey === 'default') {
        atomStaticKey = this.ctx.config.dashboard.default;
      } else if (atomStaticKey === 'home') {
        atomStaticKey = this.ctx.config.dashboard.home;
      }
      // get atomId

      // check right
    }

    async item({ dashboardAtomId, user }) {
      // try get default of dashboardUser
      const dashboardUser = await this.ctx.model.dashboardUser.get({
        dashboardAtomId,
        dashboardDefault: 1,
        userId: user.id,
      });
      if (dashboardUser) {
        return { dashboardUser };
      }
      // get system
      const dashboardSystem = await this.ctx.model.dashboardFull.get({
        atomId: dashboardAtomId,
      });
      return { dashboardSystem };
    }

    async loadItemUser({ dashboardUserId, user }) {
      return await this.ctx.model.dashboardUser.get({
        id: dashboardUserId,
        userId: user.id,
      });
    }

    // //////////////

    async list({ user }) {
      return await this.ctx.model.profile.select({
        columns: [ 'id', 'createdAt', 'updatedAt', 'deleted', 'iid', 'userId', 'profileName' ],
        where: { userId: user.id },
        orders: [[ 'profileName', 'asc' ]],
      });
    }

    async create({ data, user }) {
      data.userId = user.id;
      const res = await this.ctx.model.profile.insert(data);
      return res.insertId;
    }


    async delete({ profileId, user }) {
      return await this.ctx.model.profile.delete({ id: profileId, userId: user.id });
    }

    async save({ profileId, profileValue, user }) {
      // try get item of user
      const item = await this.item({ profileId, user });
      if (!item) return;
      await this.ctx.model.profile.update({
        id: profileId,
        profileValue: JSON.stringify(profileValue),
      });
    }

  }

  return Profile;
};
