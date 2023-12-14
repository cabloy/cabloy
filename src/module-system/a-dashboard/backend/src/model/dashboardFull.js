module.exports = class DashboardFull extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDashboardViewFull', options: { disableDeleted: false } });
  }
};
