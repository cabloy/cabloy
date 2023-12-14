module.exports = class Settings extends module.meta.class.Model {
  constructor() {
    super({ table: 'aSettings', options: { disableDeleted: true } });
  }
};
