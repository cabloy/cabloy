module.exports = class AppFull extends module.app.meta.Model {
  constructor() {
    super({ table: 'aAppViewFull', options: { disableDeleted: false } });
  }
};
