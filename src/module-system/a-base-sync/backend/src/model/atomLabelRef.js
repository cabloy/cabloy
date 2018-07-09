module.exports = app => {

  class AtomLabelRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomLabelRef', options: { disableDeleted: true } });
    }

  }

  return AtomLabelRef;
};
