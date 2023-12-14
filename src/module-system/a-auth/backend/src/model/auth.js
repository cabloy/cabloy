module.exports = class Auth extends module.app.meta.Model {
  constructor() {
    super({ table: 'aAuth', options: { disableDeleted: true } });
  }
};
