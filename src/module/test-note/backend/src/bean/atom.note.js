module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add note
      const res = await this.ctx.model.note.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update note
      const data = await this.ctx.model.note.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.note.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete note
      await this.ctx.model.note.delete({
        id: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    _getMeta(item) {
      // flags
      const flags = [];
      // meta
      const meta = {
        summary: item.description,
        flags,
      };
      // ok
      item._meta = meta;
    }
  }

  return Atom;
};
