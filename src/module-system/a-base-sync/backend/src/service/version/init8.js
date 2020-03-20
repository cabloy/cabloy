module.exports = function(ctx) {

  class VersionInit {

    async run() {
      // roleFunctions: panels
      const rolePanels = [
        { roleName: null, name: 'panelMenu' },
        { roleName: null, name: 'panelAtom' },
        { roleName: null, name: 'panelSearch' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions: rolePanels });

      // roleFunctions: widgets
      const roleWidgets = [
        { roleName: null, name: 'widgetAbout' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleWidgets });

      // roleFunctions: sections
      const roleSections = [
        { roleName: null, name: 'sectionCopyright' },
        { roleName: null, name: 'sectionClock' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleSections });

      // roleFunctions: buttons
      const roleButtons = [
        { roleName: null, name: 'buttonDashboard' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleButtons });


    }

  }

  return VersionInit;
};
