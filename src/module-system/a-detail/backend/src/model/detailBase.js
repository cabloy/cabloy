module.exports = class Detail extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDetailBase', options: { disableDeleted: false } });
  }
};
