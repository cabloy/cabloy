module.exports = app => {

  class RoleFunction extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleFunction', options: { disableDeleted: true } });
    }

  }

  return RoleFunction;
};
