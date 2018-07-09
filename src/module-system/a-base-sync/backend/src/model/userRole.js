module.exports = app => {

  class UserRole extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserRole', options: { disableDeleted: true } });
    }

  }

  return UserRole;
};
