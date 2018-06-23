module.exports = app => {

  class FunctionLocale extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionLocale', options: { disableDeleted: true } });
    }

  }

  return FunctionLocale;
};
