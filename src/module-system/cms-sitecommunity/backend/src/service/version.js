module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-community-user
        const roles = [ 'cms-community-user' ];
        const roleAuthenticated = await this.ctx.meta.role.getSystemRole({ roleName: 'authenticated' });
        const userRoot = await this.ctx.meta.user.get({ userName: 'root' });
        for (const roleName of roles) {
          const roleId = await this.ctx.meta.role.add({
            roleName,
            roleIdParent: roleAuthenticated.id,
          });
          // add user to role
          await this.ctx.meta.role.addUserRole({
            userId: userRoot.id,
            roleId,
          });
        }
        // build roles
        await this.ctx.meta.role.build();

        // add role rights
        const roleRights = [
          { roleName: 'cms-community-user', action: 'create' },
          { roleName: 'cms-community-user', action: 'write', scopeNames: 0 },
          { roleName: 'cms-community-user', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-community-user', action: 'read', scopeNames: 'cms-community-user' },
          { roleName: 'root', action: 'read', scopeNames: 'cms-community-user' },
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
