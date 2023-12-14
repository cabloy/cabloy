module.exports = class DashboardUser extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDashboardUser', options: { disableDeleted: false } });
  }
};
