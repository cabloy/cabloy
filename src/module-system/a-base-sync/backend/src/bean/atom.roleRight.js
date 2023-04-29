module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      await super.create({ atomClass, item, options, user });
      // atomIdMain
      const atomIdMain = options.atomIdMain;
      // add roleRight
      const res = await this.ctx.model.roleRight.insert({
        roleAtomId: atomIdMain,
      });
      // const roleRightId = await this.ctx.bean.role.addRoleRight({
      //   roleAtomId: atomIdMain,
      //   atomClassId: item.atomClassId,
      //   action: item.action,
      //   scope: item.scope,
      //   user,
      // });
      // const itemId = roleRightId;
      // return key
      const itemId = res.insertId;
      return { atomId: itemId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item, options);
      // ok
      return item;
    }

    async selectQuery({ atomClass, options, user }) {
      options.orders = [
        //
        ['f.moduleTarget', 'asc'],
        ['f.atomClassIdTarget', 'asc'],
        ['f.action', 'asc'],
        ['f.id', 'asc'], // action maybe duplicated, so use f.id force to unique
      ];
      // super
      return await super.selectQuery({ atomClass, options, user });
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item, options);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update roleRight
      const roleRightId = key.itemId;
      await this.ctx.bean.role.addRoleRight({
        atomClassId: item.atomClassId,
        action: item.action,
        scope: item.scope,
        user,
        roleRightId,
      });
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete roleRight
      const roleRightId = key.itemId;
      await this.ctx.bean.role.deleteRoleRight({ roleRightId, user });
    }

    _getMeta(/* item, options*/) {
      // layout: list/table/mobile/pc
      // const layout = options && options.layout;
      // meta
      // const meta = this._ensureItemMeta(item);
    }
  }

  return Atom;
};
