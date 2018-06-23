module.exports = app => {

  class RoleRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRef', options: { disableDeleted: true } });
    }

    async getParent({ roleId, level = 1 }) {
      const roleRef = await this.get({
        roleId,
        level,
      });
      return roleRef;
    }

  }

  return RoleRef;
};
