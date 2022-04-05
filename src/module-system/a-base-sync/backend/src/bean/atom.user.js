module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    get beanUser() {
      return this.ctx.bean.user;
    }

    async create({ atomClass, item, options, user }) {
      // only support atomStage=1
      if (item.atomStage !== 1) throw new Error('user only support atomStage=1');
      // fields
      const disabled = item.disabled || 0;
      const anonymous = item.anonymous || 0;
      // super
      const key = await super.create({ atomClass, item, options, user });
      const atomId = key.atomId;
      // add user
      //   item.itemId only be set from inner access
      let itemId = item.itemId;
      if (!itemId) {
        const _atomNew = await this.ctx.bean.atom.modelAtom.get({ id: atomId });
        const userName = _atomNew.atomName;
        const res = await this.ctx.model.user.insert({
          atomId: key.atomId,
          disabled,
          anonymous,
          userName,
        });
        itemId = res.insertId;
      } else {
        await this.ctx.model.user.update({
          id: itemId,
          disabled,
          anonymous,
          atomId,
        });
      }
      // ok
      return { atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      await this._getMeta(options, item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        await this._getMeta(options, item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update user
      const data = await this.ctx.model.user.prepareData(item);
      data.id = key.itemId;
      if (item.atomName) data.userName = item.atomName;
      await this.ctx.model.user.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete user
      await this.ctx.model.user.delete({
        id: key.itemId,
      });
    }

    async _getMeta(/* options, item*/) {
      // // meta
      // const meta = this._ensureItemMeta(item);
      // // meta.summary
      // meta.summary = item.description;
    }
  }

  return Atom;
};
