module.exports = app => {

  class User extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUser', options: { disableDeleted: false } });
    }

  }

  return User;
};
