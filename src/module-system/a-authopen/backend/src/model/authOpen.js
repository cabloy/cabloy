module.exports = class AuthOpen extends module.app.meta.Model {
  constructor() {
    super({ table: 'aAuthOpen', options: { disableDeleted: false } });
  }
};
