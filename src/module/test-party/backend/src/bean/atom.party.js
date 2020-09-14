module.exports = app => {

  const gPartyTypeEmojis = {
    Birthday: '🎂',
    Dance: '💃',
    Garden: '🏡',
  };

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add party
      const res = await this.ctx.model.party.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, user }) {
      // super
      const item = await super.read({ atomClass, key, user });
      if (!item) return null;
      // read
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // select
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, key, item, user }) {
      // super
      await super.write({ atomClass, key, item, user });
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
      // super
      await super.delete({ atomClass, key, user });
    }

    async action({ action, atomClass, key, user }) {
      // super
      await super.action({ action, atomClass, key, user });
      // action
      if (action === 101) {
        // change flag
        await this.ctx.bean.atom.flag({
          key,
          atom: { atomFlag: 2 },
          user,
        });
      }
    }

    async enable({ atomClass, key, atom, user }) {
      // super
      await super.enable({ atomClass, key, atom, user });
      // enable
      const atomFlag = atom.atomEnabled ? 1 : 0;
      // change flag
      await this.ctx.bean.atom.flag({
        key,
        atom: { atomFlag },
        user,
      });
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

  }

  return Atom;
};
