module.exports = class Instance extends module.app.meta.Model {
  constructor() {
    super({ table: 'aInstance', options: { disableDeleted: false, disableInstance: true } });
  }
};
