module.exports = app => {

  class PartyPublic extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'testPartyPublic', options: { disableDeleted: false } });
    }

  }

  return PartyPublic;
};
