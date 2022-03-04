module.exports = app => {
  class UserOnline extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aUserOnline', options: { disableDeleted: false } });
    }
  }
  return UserOnline;
};
