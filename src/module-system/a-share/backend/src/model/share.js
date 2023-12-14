module.exports = class Share extends module.app.meta.Model {
  constructor() {
    super({ table: 'aShare', options: { disableDeleted: false } });
  }
};
