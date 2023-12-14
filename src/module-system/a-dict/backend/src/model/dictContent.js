module.exports = class DictContent extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDictContent', options: { disableDeleted: false } });
  }
};
