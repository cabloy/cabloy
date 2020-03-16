module.exports = app => {

  class FunctionScene extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionScene', options: { disableDeleted: true } });
    }

  }

  return FunctionScene;
};
