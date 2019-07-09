module.exports = app => {

  class Party extends app.Service {

    async create({ atomClass, key, item, user }) {
      // add party
      const res = await this.ctx.model.party.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, item, user }) {
      // read
    }

    async select({ atomClass, options, items, user }) {
      // select
    }

    async write({ atomClass, key, item, user }) {
      // update party
      await this.ctx.model.party.update({
        id: key.itemId,
        personCount: item.personCount,
        partyTypeId: item.partyTypeId,
      });
    }

    async delete({ atomClass, key, user }) {
      // delete party
      await this.ctx.model.party.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
      if (action === 101) {
        // change flag
        await this.ctx.meta.atom.flag({
          key,
          atom: { atomFlag: 2 },
          user,
        });
      }
    }

    async enable({ atomClass, key, atom, user }) {
      // enable
      const atomFlag = atom.atomEnabled ? 1 : 0;
      // change flag
      await this.ctx.meta.atom.flag({
        key,
        atom: { atomFlag },
        user,
      });
    }

    async types({ empty }) {
      const items = await this.ctx.model.partyType.select();
      return items.map(item => {
        return {
          id: item.id,
          name: this.ctx.text(item.name),
        };
      });
    }

  }

  return Party;
};
