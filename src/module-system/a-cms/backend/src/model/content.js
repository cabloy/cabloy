module.exports = class Content extends module.app.meta.Model {
  constructor() {
    super({ table: 'aCmsContent', options: { disableDeleted: false } });
  }
};
