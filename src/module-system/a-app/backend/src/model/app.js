module.exports = class App extends module.meta.class.Model {
  constructor() {
    super({ table: 'aApp', options: { disableDeleted: false } });
  }
};
