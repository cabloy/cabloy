module.exports = class SettingsRef extends module.meta.class.Model {
  constructor() {
    super({ table: 'aSettingsRef', options: { disableDeleted: true } });
  }
};
