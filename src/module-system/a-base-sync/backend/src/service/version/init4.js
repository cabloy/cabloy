module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roleFunctions
      const role = await ctx.meta.role.getSystemRole({ roleName: 'root' });
      const functions = [ 'listComment' ];
      for (const functionName of functions) {
        const func = await ctx.meta.function.get({
          name: functionName,
        });
        await ctx.meta.role.addRoleFunction({
          roleId: role.id,
          functionId: func.id,
        });
      }
    }

  }

  return VersionInit;
};
