module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add resource
      const res = await this.ctx.model.resource.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
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

    async write({ atomClass, target, key, item, options, user }) {
      // force delete disabled
      delete item.disabled;
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update resource
      const data = await this.ctx.model.resource.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.resource.update(data);
      // update locales
      if (item.atomStage === 1) {
        await this.ctx.bean.resource.setLocales({
          atomId: key.atomId,
          atomName: item.atomName,
        });
      }
    }

    async delete({ atomClass, key, user }) {
      // delete resource
      await this.ctx.model.resource.delete({
        id: key.itemId,
      });
      // delete resource locales
      await this.ctx.model.resourceLocale.delete({
        atomId: key.atomId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      if (action !== 101 && action !== 102) return res;
      // enable/disable
      const resource = await this.ctx.model.resource.get({ id: atom.itemId });
      if (action === 101 && resource.disabled) return res;
      if (action === 102 && !resource.disabled) return res;
      return null;
    }

    _getMeta(item) {
      // flags
      const flags = [];
      if (item.disabled) flags.push(this.ctx.text('Disabled'));
      // meta
      const meta = {
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Atom;
};
