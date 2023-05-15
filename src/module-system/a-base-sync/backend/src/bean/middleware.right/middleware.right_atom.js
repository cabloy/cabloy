module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async checkAtom(moduleInfo, options) {
      // constant
      const constant = ctx.constant.module(moduleInfo.relativeName);

      // user
      const user = ctx.state.user.op;

      // atomClass
      const { atomKey, atomClass, atomClassBase } = await this._checkAtomClassExpect({ options });

      // select
      if (options.action === 'select') {
        const res = await ctx.bean.atom.checkRightSelect({
          atomClass,
          user,
          checkFlow: options.checkFlow,
          options: ctx.request.body.options,
        });
        if (!res) ctx.throw(403);
        return;
      }

      // create
      if (options.action === 'create' || options.action === constant.atom.action.create) {
        return await this._checkAtom_create({ atomClass, atomClassBase, user });
      }

      // read
      if (options.action === 'read' || options.action === constant.atom.action.read) {
        const res = await ctx.bean.atom.checkRightRead({
          atom: { id: atomKey.atomId },
          atomClass,
          user,
          checkFlow: options.checkFlow,
        });
        if (!res) ctx.throw(403);
        // itemId
        if (atomClassBase.itemOnly) {
          atomKey.itemId = atomKey.atomId;
        } else {
          atomKey.itemId = res.itemId;
        }
        return;
      }

      // other action (including write/delete)
      const actionOther = options.action;
      const bulk = !atomKey;
      if (bulk) {
        const res = await ctx.bean.atom.checkRightActionBulk({
          atomClass,
          action: actionOther,
          stage: options.stage,
          options: ctx.request.body.options,
          user,
        });
        if (!res) ctx.throw(403);
      } else {
        const res = await ctx.bean.atom.checkRightAction({
          atom: { id: atomKey.atomId },
          atomClass,
          action: actionOther,
          stage: options.stage,
          user,
          checkFlow: options.checkFlow,
        });
        if (!res) ctx.throw(403);
        // itemId
        if (atomClassBase.itemOnly) {
          atomKey.itemId = atomKey.atomId;
        } else {
          atomKey.itemId = res.itemId;
        }
      }
    }

    async _checkAtom_create({ atomClass, atomClassBase, user }) {
      // itemOnly
      if (atomClassBase.itemOnly) {
        const res = await ctx.bean.atom.checkRightCreate({
          atomClass,
          user,
          options: ctx.request.body.options,
        });
        if (!res) ctx.throw(403);
        return;
      }
      // roleIdOwner
      await this._checkAtom_create_checkRoleIdOwner({ atomClass, atomClassBase, user });
    }

    async _checkAtom_create_checkRoleIdOwner({ atomClass, atomClassBase, user }) {
      const enableRightRoleScopes = atomClassBase.enableRight?.role?.scopes;
      if (!enableRightRoleScopes) {
        // do nothing
        return;
      }
      // atomClassId
      const atomClassId = atomClass.id;
      // roleIdOwner
      const roleIdOwner = ctx.request.body.roleIdOwner;
      if (roleIdOwner) {
        // check
        const res = await ctx.bean.atom.checkRightCreateRole({
          atomClass: {
            id: atomClassId,
          },
          roleIdOwner,
          user,
          options: ctx.request.body.options,
        });
        if (!res) ctx.throw(403);
      } else {
        // retrieve default one, must exists
        const roleId = await ctx.bean.atom.preferredRoleId({
          atomClass: {
            id: atomClassId,
          },
          user,
        });
        if (roleId === 0) ctx.throw(403);
        ctx.request.body.roleIdOwner = roleId;
      }
    }

    _parseAtomClass(atomClass) {
      if (!atomClass) return atomClass;
      if (typeof atomClass === 'string') {
        const [module, atomClassName] = atomClass.split(':');
        return { module, atomClassName };
      }
      return atomClass;
    }

    _checkIfSameAtomClass(atomClassA, atomClassB) {
      return atomClassA.module === atomClassB.module && atomClassA.atomClassName === atomClassB.atomClassName;
    }

    async _checkAtomClassExpect({ options }) {
      // atomClassExpect
      const atomClassExpect = this._parseAtomClass(options.atomClass);
      // atomKey
      const atomKey = ctx.request.body.key;
      // atomClass: support itemOnly
      let atomClass = ctx.request.body.atomClass;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
      } else if (atomKey) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: atomKey.atomId });
      }
      // check if valid & same
      if (!atomClass && !atomClassExpect) {
        // special for select
        if (options.action !== 'select') {
          ctx.throw(403);
        }
      }
      if (atomClass && atomClassExpect && !this._checkIfSameAtomClass(atomClass, atomClassExpect)) {
        ctx.throw(403);
      }
      // neednot check !!atomClassExpect
      if (!atomClass && atomClassExpect) {
        atomClass = await ctx.bean.atomClass.get(atomClassExpect);
      }
      // force consistent for safe
      ctx.request.body.atomClass = atomClass;
      // atomClassBase
      const atomClassBase = atomClass ? await ctx.bean.atomClass.atomClass(atomClass) : null;
      // ok
      return {
        atomKey,
        atomClass,
        atomClassBase,
      };
    }
  }
  return Middleware;
};
