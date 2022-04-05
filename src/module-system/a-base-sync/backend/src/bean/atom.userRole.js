module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    get beanRole() {
      return this.ctx.bean.role;
    }
    get beanUserRole() {
      return this.ctx.bean.userRole;
    }

    async create({ atomClass, item, options, user }) {
      // only support atomStage=1
      if (item.atomStage !== 1) throw new Error('user role only support atomStage=1');
      // fields
      const userId = parseInt(item.userId || 0);
      const roleId = parseInt(item.roleId || 0);
      if (!userId || !roleId) throw new Error('userId or roleId shouldnot be empty');
      // check right
      const readRightUser = await this.beanUserRole._checkRightReadOfUser({
        userId,
        user,
      });
      if (!readRightUser) this.ctx.throw(403);
      const readRightRole = await this.beanRole._checkRightActionOfRole({
        roleId,
        action: 'read',
        user,
      });
      if (!readRightRole) this.ctx.throw(403);
      // super
      const key = await super.create({ atomClass, item, options, user });
      const atomId = key.atomId;
      // add user role
      //   item.itemId only be set from inner access
      let itemId = item.itemId;
      if (!itemId) {
        const res = await this.ctx.model.userRole.insert({
          atomId: key.atomId,
          userId,
          roleId,
        });
        itemId = res.insertId;
      } else {
        await this.ctx.model.userRole.update({
          id: itemId,
          atomId,
        });
      }
      // update roleIdOwner
      await this.ctx.model.atom.update({ id: atomId, roleIdOwner: roleId });
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
      // update user role
      const data = await this.ctx.model.userRole.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.userRole.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete user role
      await this.ctx.model.userRole.delete({
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
