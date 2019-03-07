module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // add role:template to authenticated
      const roleTemplate = await ctx.meta.role.getSystemRole({ roleName: 'template' });
      if (!roleTemplate) {
        const roleAuthenticated = await ctx.meta.role.getSystemRole({ roleName: 'authenticated' });
        await ctx.meta.role.add({
          roleName: 'template',
          leader: 0,
          catalog: 1,
          system: 1,
          sorting: 0,
          roleIdParent: roleAuthenticated.id,
        });
        // build
        await ctx.meta.role.build();
      }
    }

  }

  return VersionInit;
};
