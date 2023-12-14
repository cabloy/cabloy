module.exports = class AppFull extends module.meta.class.Model {
  constructor() {
    super({ table: 'aAppViewFull', options: { disableDeleted: false } });
  }
};
