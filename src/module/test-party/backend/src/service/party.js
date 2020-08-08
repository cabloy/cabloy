module.exports = app => {

  const gPartyTypeEmojis = {
    Birthday: '🎂',
    Dance: '💃',
    Garden: '🏡',
  };

  class Party extends app.Service {

    async create({ atomClass, key, item, user }) {
      // add party
      const res = await this.ctx.model.party.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    _getMeta(item) {
      // flags
      const flags = [];
      if (item.personCount) {
        flags.push(item.personCount);
      }
      // summary
      let summary;
      if (item.partyTypeName) {
        summary = `${gPartyTypeEmojis[item.partyTypeName]}${this.ctx.text(item.partyTypeName)}`;
      }
      // meta
      const meta = {
        flags,
        summary,
      };
      // ok
      item._meta = meta;
    }

    async read({ atomClass, key, item, user }) {
      // read
      this._getMeta(item);
    }

    async select({ atomClass, options, items, user }) {
      // select
      for (const item of items) {
        this._getMeta(item);
      }
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
