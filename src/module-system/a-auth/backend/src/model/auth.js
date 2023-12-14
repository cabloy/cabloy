module.exports = class Auth extends module.meta.class.Model {
  constructor() {
    super({ table: 'aAuth', options: { disableDeleted: true } });
  }
};
