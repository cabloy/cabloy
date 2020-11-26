module.exports = app => {
  class AtomTagRef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAtomTagRef', options: { disableDeleted: true } });
    }
  }
  return AtomTagRef;
};
