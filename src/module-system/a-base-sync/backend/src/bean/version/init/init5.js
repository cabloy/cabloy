module.exports = function (ctx) {
  class VersionInit {
    async run(options) {
      // add role:template to authenticated
      // add role:system to template
      const items = [
        {
          roleName: 'template',
          leader: 0,
          catalog: 1,
          system: 1,
          sorting: 0,
          roleIdParent: 'authenticated',
        },
        {
          roleName: 'system',
          leader: 0,
          catalog: 0,
          system: 1,
          sorting: 1,
          roleIdParent: 'template',
        },
      ];
      let needBuild = false;
      for (const item of items) {
        const role = await ctx.bean.role.getSystemRole({ roleName: item.roleName });
        if (!role) {
          needBuild = true;
          const roleParent = await ctx.bean.role.getSystemRole({ roleName: item.roleIdParent });
          const roleId = await ctx.bean.role.add({
            roleName: item.roleName,
            leader: item.leader,
            catalog: item.catalog,
            system: item.system,
            sorting: item.sorting,
            roleIdParent: roleParent.id,
          });
          if (item.roleName === 'system') {
            // superuser include system
            const roleSuperuser = await ctx.bean.role.getSystemRole({ roleName: 'superuser' });
            await ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
          }
        }
      }
      // build
      if (needBuild) {
        await ctx.bean.role.setDirty(true);
      }
    }
  }

  return VersionInit;
};
