module.exports = class LayoutContent extends module.app.meta.Model {
  constructor() {
    super({ table: 'aLayoutContent', options: { disableDeleted: false } });
  }
};
