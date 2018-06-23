module.exports = app => {

  class RoleRightRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRightRef', options: { disableDeleted: true } });
    }

  }

  return RoleRightRef;
};
