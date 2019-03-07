module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-community to template
        const roles = [ 'cms-community' ];
        const roleTemplate = await this.ctx.meta.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.meta.role.getSystemRole({ roleName: 'superuser' });
        const roleActivated = await this.ctx.meta.role.getSystemRole({ roleName: 'activated' });
        for (const roleName of roles) {
          const roleId = await this.ctx.meta.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-community
          await this.ctx.meta.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
          // role:activated include cms-community
          await this.ctx.meta.role.addRoleInc({ roleId: roleActivated.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.meta.role.build();

        // add role rights
        const roleRights = [
          { roleName: 'cms-community', action: 'create' },
          { roleName: 'cms-community', action: 'write', scopeNames: 0 },
          { roleName: 'cms-community', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-community', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
        ];
        const module = this.ctx.app.meta.modules[this.ctx.module.info.relativeName];
        const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'post' });
        for (const roleRight of roleRights) {
          // role
          const role = await this.ctx.meta.role.get({ roleName: roleRight.roleName });
          // scope
          let scope;
          if (!roleRight.scopeNames) {
            scope = 0;
          } else {
            const roleScope = await this.ctx.meta.role.get({ roleName: roleRight.scopeNames });
            scope = [ roleScope.id ];
          }
          // add role right
          await this.ctx.meta.role.addRoleRight({
            roleId: role.id,
            atomClassId: atomClass.id,
            action: this.ctx.constant.module('a-base').atom.action[roleRight.action] || module.main.meta.base.atoms.post
              .actions[roleRight.action].code,
            scope,
          });
        }

      }
    }

    async test() {
    }

  }

  return Version;
};
