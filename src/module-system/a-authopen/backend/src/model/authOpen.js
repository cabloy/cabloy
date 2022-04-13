module.exports = app => {
  class AuthOpen extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuthOpen', options: { disableDeleted: false } });
    }
  }
  return AuthOpen;
};
