module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add dict
      const res = await this.ctx.model.dict.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.dictContent.insert({
        atomId: key.atomId,
        itemId,
        dictItems: '[]',
        dictLocales: '{}',
      });
      // return key
      return { atomId: key.atomId, itemId };
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
      // update dict
      const data = await this.ctx.model.dict.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.dict.update(data);
      // update content
      await this.ctx.model.dictContent.update(
        {
          dictItems: item.dictItems,
          dictLocales: item.dictLocales,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
    }

    async delete({ atomClass, key, user }) {
      // delete dict
      await this.ctx.model.dict.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.dictContent.delete({
        itemId: key.itemId,
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
