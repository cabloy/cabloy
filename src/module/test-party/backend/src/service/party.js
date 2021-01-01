module.exports = app => {

  class Party extends app.Service {

    async types() {
      const items = await this.ctx.model.partyType.select();
      return items.map(item => {
        return {
          id: item.id,
          name: this.ctx.text(item.name),
        };
      });
    }

    async over({ key, user }) {
      await this.ctx.model.party.update({
        id: key.itemId,
        partyOver: 1,
      });
    }

    async overBulk({ keys, user }) {

    }

  }

  return Party;
};
