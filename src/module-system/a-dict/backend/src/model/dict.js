module.exports = class Dict extends module.app.meta.Model {
  constructor() {
    super({ table: 'aDict', options: { disableDeleted: false } });
  }
};
