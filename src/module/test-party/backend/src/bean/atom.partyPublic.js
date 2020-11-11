module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add party
      const res = await this.ctx.model.partyPublic.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, user }) {
      // super
      return await super.read({ atomClass, key, user });
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
    }

    async write({ atomClass, key, item, options, user }) {
      // super
      await super.write({ atomClass, key, item, options, user });
      // update partyPublic
      const data = await this.ctx.model.partyPublic.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.partyPublic.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete party
      await this.ctx.model.partyPublic.delete({
        id: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

  }

  return Atom;
};
