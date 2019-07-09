module.exports = app => {

  class Party extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'testParty', options: { disableDeleted: false } });
    }

  }

  return Party;
};
