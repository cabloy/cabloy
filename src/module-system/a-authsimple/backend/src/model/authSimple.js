module.exports = class AuthSimple extends module.meta.class.Model {
  constructor() {
    super({ table: 'aAuthSimple', options: { disableDeleted: true } });
  }
};
