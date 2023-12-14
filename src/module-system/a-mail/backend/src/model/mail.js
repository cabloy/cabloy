module.exports = class Mail extends module.meta.class.Model {
  constructor() {
    super({ table: 'aMail', options: { disableDeleted: false } });
  }
};
