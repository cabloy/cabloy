module.exports = class DashboardContent extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDashboardContent', options: { disableDeleted: false } });
  }
};
