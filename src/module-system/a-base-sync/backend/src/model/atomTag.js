module.exports = app => {
  class AtomTag extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAtomTag', options: { disableDeleted: true } });
    }
  }
  return AtomTag;
};
