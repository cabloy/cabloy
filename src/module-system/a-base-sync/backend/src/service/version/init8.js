module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roleFunctions: panels
      const roleFunctions = [
        { roleName: 'root', name: 'panelMenu' },
        { roleName: 'root', name: 'panelAtom' },
        { roleName: 'root', name: 'panelSearch' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

  }

  return VersionInit;
};
