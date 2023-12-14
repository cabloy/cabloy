module.exports = class DictContent extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDictContent', options: { disableDeleted: false } });
  }
};
