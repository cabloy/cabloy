module.exports = class Dashboard extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDashboard', options: { disableDeleted: false } });
  }
};
