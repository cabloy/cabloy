module.exports = app => {

  class RoleInc extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleInc', options: { disableDeleted: true } });
    }

  }

  return RoleInc;
};
