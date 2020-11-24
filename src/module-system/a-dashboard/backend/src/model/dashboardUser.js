module.exports = app => {
  class DashboardUser extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardUser', options: { disableDeleted: false } });
    }
  }
  return DashboardUser;
};
