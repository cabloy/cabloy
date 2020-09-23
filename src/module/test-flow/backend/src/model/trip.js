module.exports = app => {
  class Trip extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testTrip', options: { disableDeleted: false } });
    }
  }
  return Trip;
};
