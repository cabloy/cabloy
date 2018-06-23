module.exports = app => {

  class UserRoleIncRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserRoleIncRef', options: { disableDeleted: true } });
    }

  }

  return UserRoleIncRef;
};
