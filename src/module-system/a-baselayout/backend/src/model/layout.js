module.exports = class Layout extends module.meta.class.Model {
  constructor() {
    super({ table: 'aLayout', options: { disableDeleted: false } });
  }
};
