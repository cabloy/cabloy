module.exports = class LayoutFull extends module.meta.class.Model {
  constructor() {
    super({ table: 'aLayoutViewFull', options: { disableDeleted: false } });
  }
};
