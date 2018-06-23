module.exports = app => {

  class RoleIncRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleIncRef', options: { disableDeleted: true } });
    }

  }

  return RoleIncRef;
};
