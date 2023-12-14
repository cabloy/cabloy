module.exports = class DashboardUser extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDashboardUser', options: { disableDeleted: false } });
  }
};
