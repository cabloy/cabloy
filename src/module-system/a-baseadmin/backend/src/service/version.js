module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions
        const role = await this.ctx.meta.role.getSystemRole({ roleName: 'superuser' });
        const functions = [ 'user', 'role', 'atomRight', 'menuRight', 'functionRight', 'auth' ];
        for (const functionName of functions) {
          const func = await this.ctx.meta.function.get({
            name: functionName,
          });
          await this.ctx.meta.role.addRoleFunction({
            roleId: role.id,
            functionId: func.id,
          });
        }
      }
    }

  }

  return Version;
};
