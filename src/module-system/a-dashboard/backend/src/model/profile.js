module.exports = app => {
  class Profile extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardProfile', options: { disableDeleted: false } });
    }
  }
  return Profile;
};
