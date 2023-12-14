module.exports = class Content extends module.meta.class.Model {
  constructor() {
    super({ table: 'aCmsContent', options: { disableDeleted: false } });
  }
};
