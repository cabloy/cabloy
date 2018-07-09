module.exports = app => {

  class Auth extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuth', options: { disableDeleted: true } });
    }

  }

  return Auth;
};
