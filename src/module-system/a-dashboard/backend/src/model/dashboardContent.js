module.exports = app => {
  class DashboardContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardContent', options: { disableDeleted: false } });
    }
  }
  return DashboardContent;
};
