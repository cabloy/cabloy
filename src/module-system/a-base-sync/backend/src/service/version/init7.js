module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roleFunctions
      const roleFunctions = [
        { roleName: 'system', name: 'deleteComment' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

  }

  return VersionInit;
};
