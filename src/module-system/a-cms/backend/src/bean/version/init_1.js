module.exports = class Version {
  async _init_1(options) {
    // create roles: cms-writer to template
    const roles = ['cms-writer'];
    const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
    const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
    for (const roleName of roles) {
      const roleId = await this.ctx.bean.role.add({
        roleName,
        roleIdParent: roleTemplate.id,
      });
      // role:superuser include cms-writer
      await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
    }
    // build roles
    await this.ctx.bean.role.setDirty(true);

    // add role rights
    const roleRights = [
      { roleName: 'cms-writer', action: 'create' },
      { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
      { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
      { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
      { roleName: 'cms-writer', action: 'clone', scopeNames: 0 },
      { roleName: 'cms-writer', action: 'deleteBulk' },
      { roleName: 'cms-writer', action: 'exportBulk' },
      { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
      { roleName: 'root', action: 'read', scopeNames: 0 },
    ];
    await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });
  }
};
