module.exports = app => {

  class AtomStar extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomStar', options: { disableDeleted: true } });
    }

  }

  return AtomStar;
};
