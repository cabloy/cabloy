module.exports = class DashboardFull extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDashboardViewFull', options: { disableDeleted: false } });
  }
};
