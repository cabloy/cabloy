module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Role {
    // add role right
    async addRoleRight({ roleAtomId, roleId, atomClassId, action, scope, user }) {
      // check atomClass/action
      const _check = await ctx.bean.atomClass.checkRightAtomClassAction({ atomClassId, action, user });
      if (!_check) ctx.throw(403);
      // check role
      const _role = await this._forceRoleAndCheckRightRead({ roleAtomId, roleId, user });
      roleId = _role.id;
      // scope: allowed []
      if (scope) {
        if (typeof scope === 'string') {
          scope = scope.split(',');
        } else if (!Array.isArray(scope)) {
          scope = [scope];
        }
        // check right
        for (const roleIdScope of scope) {
          await this._forceRoleAndCheckRightRead({ roleAtomId: null, roleId: roleIdScope, user });
        }
      }

      // force action exists in db
      await ctx.bean.atomAction.get({ atomClassId, code: action });

      // roleRight
      const res = await this.modelRoleRight.insert({
        roleId,
        atomClassId,
        action,
        scope: JSON.stringify(scope),
      });
      const roleRightId = res.insertId;
      // roleRightRef
      if (scope) {
        for (const roleIdScope of scope) {
          await this.modelRoleRightRef.insert({
            roleRightId,
            roleId,
            atomClassId,
            action,
            roleIdScope,
          });
        }
      }
      return roleRightId;
    }

    // delete role right
    async deleteRoleRight({ roleAtomId, roleId, roleRightId, user }) {
      // role
      const _role = await this._forceRoleAndCheckRightRead({ roleAtomId, roleId, user });
      roleId = _role.id;
      // scope
      const item = await this.modelRoleRight.get({ id: roleRightId });
      const scope = JSON.parse(item.scope);
      if (scope) {
        // check right
        for (const roleIdScope of scope) {
          await this._forceRoleAndCheckRightRead({ roleAtomId: null, roleId: roleIdScope, user });
        }
      }
      // id + roleId for safety
      await this.modelRoleRight.delete({ id: roleRightId, roleId });
      await this.modelRoleRightRef.delete({ roleRightId, roleId });
    }

    async deleteRoleRightByAction({ atomClassId, action }) {
      await this.modelRoleRight.delete({ atomClassId, action });
      await this.modelRoleRightRef.delete({ atomClassId, action });
    }

    // const roleRights = [
    //   { roleName: 'cms-writer', action: 'create' },
    //   { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
    //   { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
    //   { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
    //   { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
    // ];
    async addRoleRightBatch({ module, atomClassName, roleRights }) {
      // module
      module = module || this.moduleName;
      // const _module = ctx.app.meta.modules[module];
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({ module, atomClassName });
      // roleRights
      if (!roleRights || !roleRights.length) return;
      for (const roleRight of roleRights) {
        // role
        let role;
        if (roleRight.roleAtomId || roleRight.roleId) {
          role = await this._forceRole({ roleAtomId: roleRight.roleAtomId, roleId: roleRight.roleId });
        } else {
          role = await this.parseRoleName({ roleName: roleRight.roleName, force: true });
        }
        // scope
        const scope = await this._parseScopeNames({ scopeNames: roleRight.scopeNames });
        // add role right
        const actionCode = ctx.bean.atomAction.parseActionCode({
          action: roleRight.action,
          atomClass: {
            module,
            atomClassName,
          },
        });
        await this.addRoleRight({
          roleId: role.id,
          atomClassId: atomClass.id,
          action: actionCode,
          scope,
          areaKey: roleRight.areaKey,
          areaScope: roleRight.areaScope,
        });
      }
    }

    async _parseScopeNames({ scopeNames }) {
      let scope;
      if (!scopeNames) {
        scope = 0;
      } else {
        scope = [];
        const _scopeNames = Array.isArray(scopeNames) ? scopeNames : scopeNames.split(',');
        for (const scopeName of _scopeNames) {
          let roleScopeId;
          if (typeof scopeName === 'number') {
            roleScopeId = scopeName;
          } else {
            const roleScope = await this.parseRoleName({ roleName: scopeName, force: false });
            roleScopeId = roleScope.id;
          }
          scope.push(roleScopeId);
        }
      }
      return scope;
    }

    // role rights
    async roleRights({ roleAtomId, roleId, page }) {
      roleId = await this._forceRoleId({ roleAtomId, roleId });
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const items = await ctx.model.query(
        `
        select a.*,b.module,b.atomClassName,c.name as actionName,c.bulk as actionBulk,c.actionMode,d.atomName as flowDefName from aRoleRight a
          inner join aAtomClass b on a.atomClassId=b.id
          inner join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aAtom d on c.flowKey=d.atomStaticKey and d.atomStage=1
            where a.iid=? and a.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      // scope
      await this._adjustAtomRightsScopeRoles({ items });
      // area scope
      await this._translateAreaScopeValue({ items });
      // actionFlows
      await this._adjustFlowActionsLocale({ items, actionNameKey: 'actionName' });
      // ok
      return items;
    }

    // role spreads
    async roleSpreads({ roleAtomId, roleId, page }) {
      roleId = await this._forceRoleId({ roleAtomId, roleId });
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const items = await ctx.model.query(
        `
        select d.*,d.id as roleExpandId,a.id as roleRightId,a.scope,a.areaKey,a.areaScope,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,c.bulk as actionBulk,c.actionMode,e.roleName as roleNameBase,f.atomName as flowDefName from aRoleRight a
          inner join aAtomClass b on a.atomClassId=b.id
          inner join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          inner join aRoleExpand d on a.roleId=d.roleIdBase
          inner join aRole e on d.roleIdBase=e.id
          left join aAtom f on c.flowKey=f.atomStaticKey and f.atomStage=1
            where d.iid=? and d.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      // scope
      await this._adjustAtomRightsScopeRoles({ items });
      // area scope
      await this._translateAreaScopeValue({ items });
      // locale
      await this._adjustAtomRightsLocale({ items });
      // actionFlows
      await this._adjustFlowActionsLocale({ items, actionNameKey: 'actionName' });
      // ok
      return items;
    }

    // atom rights of user
    async atomRightsOfUser({ userAtomId, userId, page }) {
      userId = await ctx.bean.user._forceUserId({ userAtomId, userId });
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const items = await ctx.model.query(
        `
        select a.*,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,c.bulk as actionBulk,c.actionMode,e.roleName as roleNameBase,f.atomName as flowDefName from aViewUserRightAtomClass a
          inner join aAtomClass b on a.atomClassId=b.id
          inner join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          inner join aRole e on a.roleIdBase=e.id
          left join aAtom f on c.flowKey=f.atomStaticKey and f.atomStage=1 
            where a.iid=? and a.userIdWho=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `,
        [ctx.instance.id, userId]
      );
      // scope
      await this._adjustAtomRightsScopeRoles({ items });
      // area scope
      await this._translateAreaScopeValue({ items });
      // locale
      await this._adjustAtomRightsLocale({ items });
      // actionFlows
      await this._adjustFlowActionsLocale({ items, actionNameKey: 'actionName' });
      // ok
      return items;
    }

    async _adjustAtomRightsScopeRoles({ items }) {
      for (const item of items) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
    }

    async _adjustAtomRightsLocale({ items }) {
      for (const item of items) {
        // roleNameBase
        if (item.roleNameBase) {
          item.roleNameBaseLocale = ctx.text(item.roleNameBase);
        }
      }
    }

    async _scopeRoles({ scope }) {
      if (!scope || scope.length === 0) return null;
      const items = await ctx.model.query(
        `
            select a.* from aRole a
              where a.iid=? and a.id in (${scope.join(',')})
            `,
        [ctx.instance.id]
      );
      return this._translateRoleNamesLocale({ items });
    }

    _translateRoleNamesLocale({ items }) {
      for (const item of items) {
        item.roleNameLocale = ctx.text(item.roleName);
      }
      return items;
    }

    async _translateAreaScopeValue({ items }) {
      for (const item of items) {
        // area scope
        const res = await ctx.bean.atom.translateAreaScopeValue({
          atomClass: { module: item.module, atomClassName: item.atomClassName },
          atomAreaKey: item.areaKey,
          atomAreaValue: item.areaScope,
        });
        if (res) {
          item.areaScopeInfo = res;
        }
      }
    }

    // actionFlows
    async _adjustFlowActionsLocale({ items, actionNameKey }) {
      for (const item of items) {
        if (item.actionMode === 1) {
          item[`${actionNameKey}Locale`] = ctx.text(item[actionNameKey] || 'Unnamed');
          item.flowDefNameLocale = ctx.text(item.flowDefName);
        }
      }
    }
  }

  return Role;
};
