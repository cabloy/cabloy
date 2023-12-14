module.exports = class AuthProvider extends module.meta.class.Model {
  constructor() {
    super({ table: 'aAuthProvider', options: { disableDeleted: true } });
  }
};
