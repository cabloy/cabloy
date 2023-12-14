module.exports = class Settings extends module.app.meta.Model {
  constructor() {
    super({ table: 'aSettings', options: { disableDeleted: true } });
  }
};
