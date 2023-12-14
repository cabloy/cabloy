module.exports = class Dashboard extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDashboard', options: { disableDeleted: false } });
  }
};
