module.exports = class DashboardContent extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDashboardContent', options: { disableDeleted: false } });
  }
};
