module.exports = class AppContent extends module.meta.class.Model {
  constructor() {
    super({ table: 'aAppContent', options: { disableDeleted: false } });
  }
};
