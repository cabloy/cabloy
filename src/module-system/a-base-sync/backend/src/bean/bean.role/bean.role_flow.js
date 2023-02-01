module.exports = ctx => {
  class Role {
    // const roleRights = [
    //   {
    //     roleName: 'family.father',
    //     flowKey: 'test-flow:set03_atomStateDraft',
    //     nodeDefId: 'activity_1',
    //     scopeNames: 'family',
    //   },
    // ];
    async addRoleRightBatchByModeFlow({ module, atomClassName, atomClassIdParent = 0, roleRights }) {
      // module
      module = module || this.moduleName;
      // const _module = ctx.app.meta.modules[module];
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({ module, atomClassName, atomClassIdParent });
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
        const action = await ctx.bean.atomAction.getByModeFlow({
          atomClassId: atomClass.id,
          flowKey: roleRight.flowKey,
          nodeDefId: roleRight.nodeDefId,
          nodeDefName: roleRight.nodeDefName,
        });
        await this.addRoleRight({
          roleId: role.id,
          atomClassId: atomClass.id,
          action: action.code,
          scope,
          areaKey: roleRight.areaKey,
          areaScope: roleRight.areaScope,
        });
      }
    }
  }
  return Role;
};
