const require3 = require('require3');
const uuid = require3('uuid');

module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // atomStaticKey
      if (!item.atomStaticKey) {
        item.atomStaticKey = uuid.v4().replace(/-/g, '');
      }
      // super
      const key = await super.create({ atomClass, item, user });
      // add profile
      const res = await this.ctx.model.profile.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.profileContent.insert({
        atomId: key.atomId,
        itemId,
        content: '{}',
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, key, user }) {
      // super
      const item = await super.read({ atomClass, key, user });
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

    async write({ atomClass, key, item, options, user }) {
      // super
      await super.write({ atomClass, key, item, options, user });
      // update profile
      const data = await this.ctx.model.profile.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.profile.update(data);
      // update content
      await this.ctx.model.profileContent.update({
        content: item.content,
      }, { where: {
        atomId: key.atomId,
      } });
    }

    async delete({ atomClass, key, user }) {
      // delete profile
      await this.ctx.model.profile.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.profileContent.delete({
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
