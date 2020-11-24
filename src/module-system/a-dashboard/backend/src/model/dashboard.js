module.exports = app => {
  class Dashboard extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboard', options: { disableDeleted: false } });
    }
  }
  return Dashboard;
};
