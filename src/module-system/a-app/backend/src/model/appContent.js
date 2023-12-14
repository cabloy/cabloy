module.exports = class AppContent extends module.app.meta.Model {
  constructor() {
    super({ table: 'aAppContent', options: { disableDeleted: false } });
  }
};
