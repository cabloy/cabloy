module.exports = app => {

  class Version extends app.Service {

    // eslint-disable-next-line
    async update(options) {
    }

    async init(options) {

      if (options.version === 1) {

        // roleFunctions: panels
        const rolePanels = [
          { roleName: null, name: 'panelMenu' },
          { roleName: null, name: 'panelAtom' },
          { roleName: null, name: 'panelSearch' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions: rolePanels });

        // roleFunctions: sections
        const roleSections = [
          { roleName: null, name: 'sectionCopyright' },
          { roleName: null, name: 'sectionClock' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleSections });

        // roleFunctions: buttons
        const roleButtons = [
          { roleName: null, name: 'buttonDashboard' },
          { roleName: null, name: 'buttonFullscreen' },
          { roleName: null, name: 'buttonMine' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleButtons });

      }

    }

  }

  return Version;
};
