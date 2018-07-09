module.exports = app => {

  class AtomAction extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomAction', options: { disableDeleted: false } });
    }

  }

  return AtomAction;
};
