module.exports = class User {
  async select({ query, page, user }) {
    return await this.ctx.bean.user.selectGeneral({ params: { query, page }, user });
  }

  async userRoles({ userAtomId, page, user }) {
    return await this.ctx.bean.role.userRoles({ userAtomId, page, user });
  }

  async addUserRole({ userAtomId, roleId, user }) {
    return await this.ctx.bean.role.addUserRole({ userAtomId, roleId, user });
  }

  async deleteUserRole({ userAtomId, roleId, user }) {
    return await this.ctx.bean.role.deleteUserRole({ userAtomId, roleId, user });
  }

  async atomRights({ userAtomId, page, user }) {
    return await this.ctx.bean.role.atomRightsOfUser({ userAtomId, page, user });
  }

  async resourceRights({ userAtomId, page, user }) {
    return await this.ctx.bean.resource.resourceRightsOfUser({ userAtomId, page, user });
  }
};
