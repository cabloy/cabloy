module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-documentation-writer to template
        //   need not 'cms-documentation-publisher'
        const roles = ['cms-documentation-writer'];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-documentation
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-documentation-writer', action: 'create' },
          { roleName: 'cms-documentation-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-documentation-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'deleteBulk' },
          { roleName: 'cms-documentation-writer', action: 'exportBulk' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
          { roleName: 'root', action: 'layout', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'preview', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'document', roleRights });
      }
    }

    async test() {}
  }

  return Version;
};
