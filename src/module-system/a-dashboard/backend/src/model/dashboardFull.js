module.exports = app => {
  class DashboardFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardViewFull', options: { disableDeleted: false } });
    }
  }
  return DashboardFull;
};
