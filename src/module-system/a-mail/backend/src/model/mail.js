module.exports = class Mail extends module.app.meta.Model {
  constructor() {
    super({ table: 'aMail', options: { disableDeleted: false } });
  }
};
