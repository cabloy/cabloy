module.exports = class AuthOpen extends module.meta.class.Model {
  constructor() {
    super({ table: 'aAuthOpen', options: { disableDeleted: false } });
  }
};
