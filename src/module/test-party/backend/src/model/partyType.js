module.exports = app => {

  class PartyType extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'testPartyType', options: { disableDeleted: true } });
    }

  }

  return PartyType;
};
