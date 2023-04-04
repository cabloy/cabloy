module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async checkRoleRightRead({ atom: { id }, roleId }) {
      // not check draft
      const atomId = id;
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // formal/history
      const sql = await this.sqlProcedure.checkRoleRightRead({
        iid: ctx.instance.id,
        roleIdWho: roleId,
        atomId,
        forAtomUser,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightRead({ atom: { id }, atomClass, user, checkFlow, disableAuthOpenCheck }) {
      let _atom;
      if (!atomClass) {
        _atom = await this.modelAtom.get({ id });
        if (!_atom) ctx.throw.module(moduleInfo.relativeName, 1002);
        // atomClass
        atomClass = await ctx.bean.atomClass.get({ id: _atom.atomClassId });
      } else {
        _atom = { id };
        atomClass = await ctx.bean.atomClass.get(atomClass);
      }
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // normal check
      const res = await this._checkRightRead_normal({ _atom, atomClass, user, checkFlow });
      if (!res) return res;
      // auth open check
      if (!disableAuthOpenCheck) {
        const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action: 'read' });
        if (!resAuthOpenCheck) return null;
      }
      // ok
      return res;
    }

    async _checkRightRead_normal({ _atom, atomClass, user, checkFlow }) {
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // draft: only userIdUpdated
      const atomId = _atom.id;
      // check right
      if (!atomClassBase.itemOnly) {
        if (_atom.atomStage === 0) {
          // self
          const bSelf = _atom.userIdUpdated === user.id;
          // checkFlow
          if (_atom.atomFlowId > 0 && checkFlow) {
            const flow = await ctx.bean.flow.get({ flowId: _atom.atomFlowId, history: true, user });
            if (!flow) return null;
            return _atom;
          }
          // 1. closed
          if (_atom.atomClosed) {
            if (bSelf) return _atom;
            return null;
          }
          // // 2. flow
          // if (_atom.atomFlowId > 0) return null;
          // 3. self
          if (bSelf) return _atom;
          // others
          return null;
        }
      }
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // formal/history
      const sql = await this.sqlProcedure.checkRightRead({
        iid: ctx.instance.id,
        atomClass,
        atomClassBase,
        userIdWho: user.id,
        atomId,
        forAtomUser,
      });
      if (sql === false) return null;
      return await ctx.model.queryOne(sql);
    }

    // atomClass: { id, module, atomClassName }
    async checkRightActionBulk({ atomClass, action, stage, user }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // normal check
      const res = await this._checkRightActionBulk_normal({ atomClass, action, stage, user });
      if (!res) return res;
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action });
      if (!resAuthOpenCheck) return null;
      // ok
      return res;
    }

    async _checkRightActionBulk_normal({ atomClass, action, stage, user }) {
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // parse action code
      action = ctx.bean.atomAction.parseActionCode({
        action,
        atomClass,
      });
      // check right
      const sql = this.sqlProcedure.checkRightActionBulk({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        action,
      });
      const actionRes = await ctx.model.queryOne(sql);
      return await this.__checkRightActionBulk({ atomClassBase, actionRes, stage, user });
    }

    async checkRightCreate({ atomClass, user }) {
      return await this.checkRightActionBulk({ atomClass, action: 1, user });
    }

    // atomClass: { id, module, atomClassName }
    async checkRightCreateRole({ atomClass, roleIdOwner, user }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // normal check
      const res = await this._checkRightCreateRole_normal({ atomClass, roleIdOwner, user });
      if (!res) return res;
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action: 'create' });
      if (!resAuthOpenCheck) return null;
      // ok
      return res;
    }

    async _checkRightCreateRole_normal({ atomClass, roleIdOwner, user }) {
      if (!roleIdOwner) return null;
      const sql = this.sqlProcedure.checkRightCreateRole({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        roleIdOwner,
      });
      return await ctx.model.queryOne(sql);
    }

    // actions of atom
    async actions({ key, basic, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // actions
      const _basic = basic ? 'and a.code in (3,4)' : '';
      const sql = `
        select a.*,b.module,b.atomClassName from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.bulk=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      const actions = await ctx.model.query(sql, [ctx.instance.id, atomClass.id]);
      // actions res
      const actionsRes = [];
      for (const action of actions) {
        const res = await this.checkRightAction({ atom: { id: key.atomId }, action: action.code, user });
        if (res) {
          if (res.__task) {
            action.__task = res.__task;
          }
          actionsRes.push(action);
        }
      }
      return actionsRes;
    }

    // actionsBulk of atomClass
    async actionsBulk({ atomClass, stage, user }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const sql = this.sqlProcedure.checkRightActionBulk({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
      });
      const actionsRes = await ctx.model.query(sql);
      const res = [];
      for (const actionRes of actionsRes) {
        const _res = await this.__checkRightActionBulk({ atomClassBase, actionRes, stage, user });
        if (_res) {
          res.push(_res);
        }
      }
      return res;
    }

    // preffered roles
    async preferredRoles({ atomClass, user }) {
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // normal check
      const roles = await this._preferredRoles_normal({ atomClass, user });
      if (!roles || roles.length === 0) return roles;
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action: 'create' });
      if (!resAuthOpenCheck) return [];
      // ok
      return roles;
    }

    // preffered roles
    async _preferredRoles_normal({ atomClass, user }) {
      const roles = await ctx.model.query(
        `select a.*,b.userId,c.roleName as roleNameWho from aViewRoleRightAtomClass a
          inner join aUserRole b on a.roleIdWho=b.roleId
          left join aRole c on a.roleIdWho=c.id
          where a.iid=? and a.atomClassId=? and a.action=1 and b.userId=?
          order by a.roleIdWho desc`,
        [ctx.instance.id, atomClass.id, user.id]
      );
      return roles;
    }

    async preferredRole({ atomClass, user }) {
      const roles = await this.preferredRoles({ atomClass, user });
      return !roles || roles.length === 0 ? null : roles[0];
    }

    async preferredRoleId({ atomClass, user }) {
      const role = await this.preferredRole({ atomClass, user });
      return role ? role.roleIdWho : 0;
    }
  }

  return Atom;
};
