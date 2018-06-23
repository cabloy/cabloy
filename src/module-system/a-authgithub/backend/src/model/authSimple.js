module.exports = app => {

  class AuthSimple extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuthSimple', options: { disableDeleted: true } });
    }

  }

  return AuthSimple;
};
