module.exports = app => {

  class FunctionStar extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionStar', options: { disableDeleted: true } });
    }

  }

  return FunctionStar;
};
