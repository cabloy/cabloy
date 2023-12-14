module.exports = class SettingsRef extends module.app.meta.Model {
  constructor() {
    super({ table: 'aSettingsRef', options: { disableDeleted: true } });
  }
};
