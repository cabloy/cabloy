module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add {{atomClassName}}
      const res = await this.ctx.model.{{atomClassName}}.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, user }) {
      // super
      const item = await super.read({ atomClass, key, user });
      if (!item) return null;
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
    }

    async write({ atomClass, key, item, user }) {
      // super
      await super.write({ atomClass, key, item, user });
      // update {{atomClassName}}
      const data = await this.ctx.model.{{atomClassName}}.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.{{atomClassName}}.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete {{atomClassName}}
      await this.ctx.model.{{atomClassName}}.delete({
        id: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

  }

  return Atom;
};
