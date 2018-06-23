module.exports = app => {

  class AtomClass extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomClass', options: { disableDeleted: false } });
    }

  }

  return AtomClass;
};
