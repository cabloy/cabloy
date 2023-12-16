module.exports = class AtomRight {
  async rights({ roleAtomId, page, user }) {
    return await this.ctx.bean.role.roleRights({ roleAtomId, page, user });
  }

  async add({ roleAtomId, atomClass, actionCode, scopeSelf, scope, user }) {
    if (scopeSelf) {
      scope = 0;
    }
    return await this.ctx.bean.role.addRoleRight({
      roleAtomId,
      atomClass,
      // atomClassId: _atomClass.id,
      action: actionCode,
      scope,
      user,
    });
  }

  async delete({ roleAtomId, roleRightId, user }) {
    return await this.ctx.bean.role.deleteRoleRight({ roleAtomId, roleRightId, user });
  }

  async spreads({ roleAtomId, page, user }) {
    return await this.ctx.bean.role.roleSpreads({ roleAtomId, page, user });
  }
};
