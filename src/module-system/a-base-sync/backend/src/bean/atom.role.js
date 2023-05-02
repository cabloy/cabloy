module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    get beanRole() {
      return this.ctx.bean.role;
    }

    async create({ atomClass, item, options, user }) {
      // only support atomStage=1
      if (item.atomStage !== 1) throw new Error('role only support atomStage=1');
      // fields
      const catalog = item.catalog || 0;
      const system = item.system || 0;
      let roleIdParent = item.roleIdParent || 0;
      // is 0 when clone
      if (roleIdParent !== 0) {
        // roleIdParent maybe string
        if (typeof roleIdParent === 'string') {
          const role = await this.beanRole.parseRoleName({ roleName: roleIdParent, force: false });
          roleIdParent = role.id;
        }
        // check if addChild right of roleIdParent
        const addChildRight = await this.beanRole._checkRightActionOfRole({
          roleId: roleIdParent,
          action: 'addChild',
          user,
        });
        if (!addChildRight) this.ctx.throw(403);
      }
      // super
      const key = await super.create({ atomClass, item, options, user });
      const atomId = key.atomId;
      // add role
      //   item.itemId only be set from inner access
      let itemId = item.itemId;
      if (!itemId) {
        const _atomNew = await this.ctx.bean.atom.modelAtom.get({ id: atomId });
        const roleName = _atomNew.atomName;
        const res = await this.ctx.model.role.insert({
          atomId: key.atomId,
          catalog,
          system,
          roleIdParent,
          roleName,
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
      await this.beanRole.adjustCatalog(roleIdParent);
      // set dirty
      await this.beanRole.setDirty(true);
      // ok
      return { atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      await this._getMeta(options, item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      const showSorting = !!(options && options.category);
      for (const item of items) {
        await this._getMeta(options, item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      this.ctx.bean.util.checkDemoForAtomWrite();
      // roleIdParent maybe string, so cause validate error
      delete item.roleIdParent;
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update role
      const data = await this.ctx.model.role.prepareData(item);
      if (item.atomName) data.roleName = item.atomName;
      await this.ctx.model.role.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      const roleId = key.itemId;
      // force
      const force = options && options.force;
      // role
      const role = await this.beanRole.get({ id: roleId });
      // parent
      const roleIdParent = role.roleIdParent;

      // check if system
      if (role.system) this.ctx.throw(403);
      // check if children
      if (role.catalog && !force) {
        const children = await this.beanRole.children({ roleId });
        if (children.length > 0) this.ctx.throw.module(moduleInfo.relativeName, 1008);
      }

      // delete all includes
      await this.beanRole.modelRoleInc.delete({ roleId });
      await this.beanRole.modelRoleInc.delete({ roleIdInc: roleId });

      // delete all users
      await this.beanRole.modelUserRole.delete({ roleId });

      // delete all atom rights
      await this.beanRole.modelRoleRight.delete({ roleId });
      await this.beanRole.modelRoleRightRef.delete({ roleId });

      // super
      await super.delete({ atomClass, key, options, user });
      // delete role
      await this.ctx.model.role.delete({
        id: key.itemId,
      });

      // adjust catalog
      await this.beanRole.adjustCatalog(roleIdParent);

      // set dirty
      await this.beanRole.setDirty(true);
    }

    async copy({ atomClass, target, srcKey, srcItem, destKey, destItem, options, user }) {
      await super.copy({ atomClass, target, srcKey, srcItem, destKey, destItem, options, user });
      if (target === 'clone') {
        await this.ctx.model.role.update({
          id: destKey.itemId,
          catalog: 0, // srcItem.catalog,
          system: 0, // srcItem.system,
          roleIdParent: srcItem.roleIdParent,
        });
      }
    }

    async checkRightAction({ atom, atomClass, action, options, user }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, options, user });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      // delete/clone/move/addChild/roleUsers/includes/resourceAuthorizations/atomAuthorizations
      if (![4, 5, 101, 102, 103, 104, 105, 106].includes(action)) return res;
      // role
      const role = await this.ctx.model.role.get({ id: atom.itemId });
      // delete
      if (action === 4) {
        if (role.system === 1) return null;
      }
      // clone
      if (action === 5) {
        if (role.roleIdParent === 0) return null;
        if (atom.atomName === 'OpenAuthScope' && role.roleTypeCode === 6) return null;
      }
      // move
      if (action === 101) {
        if (role.system === 1) return null;
      }
      // addChild
      if (action === 102) {
        if (atom.atomName !== 'OpenAuthScope' && role.roleTypeCode === 6) return null;
      }
      // roleUsers
      if (action === 103) {
        if (role.catalog === 1) return null;
        if (role.roleTypeCode === 6) return null;
      }
      // includes
      if (action === 104) {
        // if (role.roleTypeCode === 6) return null;
      }
      // resourceAuthorizations
      if (action === 105) {
        if (['OpenAuthScope', 'RoleScopeFull'].includes(atom.atomName) && role.roleTypeCode === 6) return null;
      }
      // atomAuthorizations
      if (action === 106) {
        if (['OpenAuthScope', 'RoleScopeFull'].includes(atom.atomName) && role.roleTypeCode === 6) return null;
      }
      // default
      return res;
    }

    async _getMeta(options, item, showSorting) {
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (showSorting) {
        meta.flags.push(item.sorting);
      }
      // meta.summary
      meta.summary = item.description;
      // translate
      await this._getMetaTranslate({ item });
      // roleNameParent
      if (item.roleNameParent) {
        item.roleNameParentLocale = this.ctx.text(item.roleNameParent);
      }
    }

    async _getMetaTranslate({ item }) {
      const dictKey = 'a-base:dictRoleType';
      const atomDict = await this.ctx.bean.atom.modelAtom.get({
        atomStaticKey: dictKey,
        atomStage: 1,
      });
      if (!atomDict) {
        // do nothing
        return;
      }
      // translate
      const _item = await this._dictTranslateField({
        fieldName: 'roleTypeCode',
        code: item.roleTypeCode,
        field: {
          dictKey: 'a-base:dictRoleType',
        },
      });
      Object.assign(item, _item);
    }
  }

  return Atom;
};
