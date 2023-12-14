module.exports = class Dict extends module.meta.class.Model {
  constructor() {
    super({ table: 'aDict', options: { disableDeleted: false } });
  }
};
