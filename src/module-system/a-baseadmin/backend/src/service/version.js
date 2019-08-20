module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions
        const roleFunctions = [
          { roleName: 'system', name: 'user' },
          { roleName: 'system', name: 'role' },
          { roleName: 'system', name: 'atomRight' },
          { roleName: 'system', name: 'menuRight' },
          { roleName: 'system', name: 'functionRight' },
          { roleName: 'system', name: 'auth' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
      }
    }

  }

  return Version;
};
