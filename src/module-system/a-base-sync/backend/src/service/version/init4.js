module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roleFunctions
      const roleFunctions = [
        { roleName: 'root', name: 'listComment' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

  }

  return VersionInit;
};
