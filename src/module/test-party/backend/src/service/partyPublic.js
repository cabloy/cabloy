module.exports = app => {

  class PartyPublic extends app.Service {

    async create({ atomClass, key, item, user }) {
      const res = await this.ctx.model.partyPublic.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, item, user }) {
    }

    async select({ atomClass, options, items, user }) {
    }

    async write({ atomClass, key, item, user }) {
    }

    async delete({ atomClass, key, user }) {
      await this.ctx.model.partyPublic.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
    }

    async enable({ atomClass, key, atom, user }) {
    }

  }

  return PartyPublic;
};
