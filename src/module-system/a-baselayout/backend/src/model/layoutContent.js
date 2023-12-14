module.exports = class LayoutContent extends module.meta.class.Model {
  constructor() {
    super({ table: 'aLayoutContent', options: { disableDeleted: false } });
  }
};
