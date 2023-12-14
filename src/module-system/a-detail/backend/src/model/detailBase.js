module.exports = class Detail extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDetailBase', options: { disableDeleted: false } });
  }
};
