const require3 = require('require3');
const uuid = require3('uuid');

module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add layout
      const res = await this.ctx.model.layout.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      const content = {
        login: '/a/login/login',
        loginOnStart: true,
      };
      await this.ctx.model.layoutContent.insert({
        atomId: key.atomId,
        itemId,
        content: JSON.stringify(content),
      });
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
      // update layout
      const data = await this.ctx.model.layout.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.layout.update(data);
      // update content
      await this.ctx.model.layoutContent.update({
        content: item.content,
      }, { where: {
        atomId: key.atomId,
      } });
    }

    async delete({ atomClass, key, user }) {
      // delete layout
      await this.ctx.model.layout.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.layoutContent.delete({
        itemId: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    _getMeta(item) {
    }

  }

  return Atom;
};
