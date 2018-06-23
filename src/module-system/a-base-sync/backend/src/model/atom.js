module.exports = app => {

  class Atom extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtom', options: { disableDeleted: false } });
    }

  }

  return Atom;
};
