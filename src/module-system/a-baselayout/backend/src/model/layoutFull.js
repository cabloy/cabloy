module.exports = class LayoutFull extends module.app.meta.Model {
  constructor() {
    super({ table: 'aLayoutViewFull', options: { disableDeleted: false } });
  }
};
