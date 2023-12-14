module.exports = class Instance extends module.meta.class.Model {
  constructor() {
    super({ table: 'aInstance', options: { disableDeleted: false, disableInstance: true } });
  }
};
