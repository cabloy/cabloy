module.exports = class AuthSimple extends module.app.meta.Model {
  constructor() {
    super({ table: 'aAuthSimple', options: { disableDeleted: true } });
  }
};
