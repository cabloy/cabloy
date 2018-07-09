module.exports = app => {

  class AtomRight extends app.Service {

    async rights({ roleId, page }) {
      return await this.ctx.meta.role.roleRights({ roleId, page });
    }

    async add({ roleId, atomClass, actionCode, scopeSelf, scope }) {
      const _atomClass = await this.ctx.meta.atomClass.get(atomClass);
      if (actionCode === 1 || ((actionCode === 3 || actionCode === 4) && scopeSelf)) scope = 0;
      return await this.ctx.meta.role.addRoleRight({
        roleId,
        atomClassId: _atomClass.id,
        action: actionCode,
        scope,
      });
    }

    async delete({ id }) {
      return await this.ctx.meta.role.deleteRoleRight({ id });
    }

    async spreads({ roleId, page }) {
      return await this.ctx.meta.role.roleSpreads({ roleId, page });
    }

  }

  return AtomRight;
};
