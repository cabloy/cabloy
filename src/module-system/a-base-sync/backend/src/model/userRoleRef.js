module.exports = app => {

  class UserRoleRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserRoleRef', options: { disableDeleted: true } });
    }

  }

  return UserRoleRef;
};
