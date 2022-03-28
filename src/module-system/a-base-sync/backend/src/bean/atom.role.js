module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // only support atomStage=1
      if (item.atomStage !== 1) throw new Error('role only support atomStage=1');
      // fields
      const catalog = item.catalog || 0;
      const system = item.system || 0;
      let roleIdParent = item.roleIdParent || 0;
      // roleIdParent maybe string
      if (typeof roleIdParent === 'string') {
        const role = await this.ctx.bean.role.parseRoleName({ roleName: roleIdParent, force: false });
        roleIdParent = role.id;
      }
      // check if write right of roleIdParent
      const writeRight = await this.ctx.bean.role._checkRightWriteOfRole({
        roleId: roleIdParent,
        user,
      });
      if (!writeRight) this.ctx.throw(403);
      // super
      const key = await super.create({ atomClass, item, options, user });
      const atomId = key.atomId;
      // add role
      //   item.itemId only be set from inner access
      let itemId = item.itemId;
      if (!itemId) {
        const res = await this.ctx.model.role.insert({
          atomId: key.atomId,
          catalog,
          system,
          roleIdParent,
        });
        itemId = res.insertId;
      } else {
        await this.ctx.model.role.update({
          id: itemId,
          atomId,
          catalog,
          system,
          roleIdParent,
        });
      }
      // update roleIdOwner
      await this.ctx.model.atom.update({ id: atomId, roleIdOwner: itemId });
      // adjust catalog
      await this.ctx.bean.role.adjustCatalog(roleIdParent);
      // set dirty
      await this.ctx.bean.role.setDirty(true);
      // ok
      return { atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(options, item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      const showSorting = !!(options && options.category);
      for (const item of items) {
        this._getMeta(options, item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update role
      const data = await this.ctx.model.role.prepareData(item);
      data.id = key.itemId;
      if (item.atomName) data.roleName = item.atomName;
      await this.ctx.model.role.update(data);
    }

    async delete({ atomClass, key, user }) {
      // super
      await super.delete({ atomClass, key, user });
      // delete role
      await this.ctx.model.role.delete({
        id: key.itemId,
      });
    }

    _getMeta(options, item, showSorting) {
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (showSorting) {
        meta.flags.push(item.sorting);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
