module.exports = function(ctx) {

  class VersionInit {

    async run() {
      // roleFunctions: panels
      const roleFunctions = [
        { roleName: null, name: 'panelMenu' },
        { roleName: null, name: 'panelAtom' },
        { roleName: null, name: 'panelSearch' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

  }

  return VersionInit;
};
