module.exports = class AuthProvider extends module.app.meta.Model {
  constructor() {
    super({ table: 'aAuthProvider', options: { disableDeleted: true } });
  }
};
