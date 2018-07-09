module.exports = app => {

  class Function extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunction', options: { disableDeleted: true } });
    }

  }

  return Function;
};
