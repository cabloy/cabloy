module.exports = class App extends module.app.meta.Model {
  constructor() {
    super({ table: 'aApp', options: { disableDeleted: false } });
  }
};
