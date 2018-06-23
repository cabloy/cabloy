module.exports = app => {

  class RoleRight extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRight', options: { disableDeleted: true } });
    }

  }

  return RoleRight;
};
