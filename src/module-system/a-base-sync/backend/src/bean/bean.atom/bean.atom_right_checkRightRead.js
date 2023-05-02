module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async checkRoleRightRead({ atom: { id }, atomClass: atomClassOuter, options: optionsOuter, roleId }) {
      // not check draft
      const atomId = id;
      // atomClass
      const res = await this._prepareKeyAndAtomAndAtomClass({
        key: { atomId: id },
        atomClass: atomClassOuter,
        options: optionsOuter,
        throwWhenEmpty: false,
      });
      if (!res) return null;
      const { atomClass, atomClassBase } = res;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // formal/history
      const sql = await this.sqlProcedure.checkRoleRightRead({
        iid: ctx.instance.id,
        roleIdWho: roleId,
        atomClass,
        atomClassBase,
        atomId,
        forAtomUser,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightSelect({ atomClass, user, checkFlow, disableAuthOpenCheck, options }) {
      options = options || {};
      const atomIdMain = options.atomIdMain;
      if (!atomClass) {
        if (!atomIdMain) return true;
        ctx.throw(403);
      }
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // check detail
      const detailRightInherit = await this._checkDetailRightInherit({
        atomClass,
        atomClassBase,
        action: 'read',
        user,
        checkFlow,
        disableAuthOpenCheck,
        options,
      });
      if (!detailRightInherit) return false;
      return true;
    }

    async checkRightRead({
      atom: { id },
      atomClass: atomClassOuter,
      options: optionsOuter,
      user,
      checkFlow,
      disableAuthOpenCheck,
    }) {
      const {
        atom: _atom,
        atomClass,
        atomClassBase,
        options,
      } = await this._prepareKeyAndAtomAndAtomClass({
        key: { atomId: id },
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      // check detail
      const detailRightInherit = await this._checkDetailRightInherit({
        atomClass,
        atomClassBase,
        action: 'read',
        user,
        checkFlow,
        disableAuthOpenCheck,
        options,
      });
      if (!detailRightInherit) return null;
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
  }

  return Atom;
};
