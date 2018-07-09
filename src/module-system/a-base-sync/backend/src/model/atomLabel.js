module.exports = app => {

  class AtomLabel extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomLabel', options: { disableDeleted: true } });
    }

  }

  return AtomLabel;
};
