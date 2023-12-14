module.exports = class Share extends module.meta.class.Model {
  constructor() {
    super({ table: 'aShare', options: { disableDeleted: false } });
  }
};
