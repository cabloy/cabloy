module.exports = app => {
  class ProfileUser extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardProfileUser', options: { disableDeleted: false } });
    }
  }
  return ProfileUser;
};
