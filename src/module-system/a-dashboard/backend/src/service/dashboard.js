module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Profile extends app.Service {

    get atomClass() {
      return {
        module: moduleInfo.relativeName,
        atomClassName: 'dashboard',
      };
    }

    get sequence() {
      return this.ctx.bean.sequence.module(moduleInfo.relativeName);
    }

    async itemByKey({ atomStaticKey, user }) {
      // adjust key
      if (!atomStaticKey || atomStaticKey === 'default') {
        atomStaticKey = this.ctx.config.dashboard.default;
      } else if (atomStaticKey === 'home') {
        atomStaticKey = this.ctx.config.dashboard.home;
      }
      // get atomId
      const atom = await this.ctx.bean.atom.modelAtom.get({ atomStaticKey, atomStage: 1 });
      if (!atom) return this.ctx.throw.module('a-base', 1002);
      const atomId = atom.id;
      // check right
      const res = await this.ctx.bean.atom.checkRightRead({ atom: { id: atomId }, user, checkFlow: true });
      if (!res) this.ctx.throw(403);
      // item
      return await this.item({ dashboardAtomId: atomId, user });
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
      const dashboardSystem = await this.ctx.bean.atom.read({
        key: { atomId: dashboardAtomId }, user,
      });
      return { dashboardSystem };
    }

    async loadItemUser({ dashboardUserId, user }) {
      return await this.ctx.model.dashboardUser.get({
        id: dashboardUserId,
        userId: user.id,
      });
    }

    async saveItemUser({ dashboardUserId, content, user }) {
      await this.ctx.model.dashboardUser.update({
        content,
      }, { where: {
        id: dashboardUserId,
        userId: user.id,
      } });
    }

    async changeItemUserName({ dashboardUserId, dashboardName, user }) {
      await this.ctx.model.dashboardUser.update({
        dashboardName,
      }, { where: {
        id: dashboardUserId,
        userId: user.id,
      } });
    }

    async createItemUser({ dashboardAtomId, user }) {
      // name
      const id = await this.sequence.next('dashboard');
      const dashboardName = `${this.ctx.text('Dashboard')}-${id}`;
      // content
      const dashboardContent = await this.ctx.model.dashboardContent.get({ atomId: dashboardAtomId });
      // update old default
      await this.ctx.model.dashboardUser.update({
        dashboardDefault: 0,
      }, { where: {
        userId: user.id,
        dashboardAtomId,
      } });
      // insert
      const res = await this.ctx.model.dashboardUser.insert({
        userId: user.id,
        dashboardDefault: 1,
        dashboardAtomId,
        dashboardName,
        content: dashboardContent.content,
      });
      // ok
      return {
        dashboardUserId: res.insertId,
      };
    }

    async itemUsers({ dashboardAtomId, user }) {
      return await this.ctx.model.dashboardUser.select({
        columns: [ 'id', 'createdAt', 'updatedAt', 'deleted', 'iid', 'userId', 'dashboardDefault', 'dashboardAtomId', 'dashboardName' ],
        where: {
          userId: user.id,
          dashboardAtomId,
        },
        orders: [[ 'dashboardName', 'asc' ]],
      });
    }

    async changeItemUserDefault({ dashboardAtomId, dashboardUserId, user }) {
      await this.ctx.model.dashboardUser.update({
        dashboardDefault: 0,
      }, { where: {
        userId: user.id,
        dashboardAtomId,
      } });
      await this.ctx.model.dashboardUser.update({
        id: dashboardUserId,
        dashboardDefault: 1,
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
