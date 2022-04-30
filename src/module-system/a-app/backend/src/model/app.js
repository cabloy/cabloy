module.exports = app => {
  class App extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aApp', options: { disableDeleted: false } });
    }
  }
  return App;
};
