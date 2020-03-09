module.exports = app => {

  class Profile extends app.Service {

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

    async item({ profileId, user }) {
      return await this.ctx.model.read({ id: profileId, userId: user.id });
    }

  }

  return Profile;
};
