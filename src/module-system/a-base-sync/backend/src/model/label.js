module.exports = app => {

  class Label extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aLabel', options: { disableDeleted: true } });
    }

  }

  return Label;
};
