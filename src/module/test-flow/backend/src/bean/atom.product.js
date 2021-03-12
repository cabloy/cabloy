module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add product
      const res = await this.ctx.model.product.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update product
      const data = await this.ctx.model.product.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.product.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete product
      await this.ctx.model.product.delete({
        id: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

  }

  return Atom;
};
