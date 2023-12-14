module.exports = class Layout extends module.app.meta.Model {
  constructor() {
    super({ table: 'aLayout', options: { disableDeleted: false } });
  }
};
