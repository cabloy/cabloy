module.exports = app => {

  class Resource extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.resource.select({ options, user });
    }

    async check({ atomStaticKeys, user }) {
      return await this.ctx.bean.resource.check({ atomStaticKeys, user });
    }

    async resourceRoles({ key, user }) {
      return await this.ctx.bean.resource.resourceRoles({ key, user });
    }

    async resourceRoleRemove({ /* key,*/ data/* , user*/ }) {
      return await this.ctx.bean.resource.deleteResourceRole({ id: data.resourceRoleId });
    }

    async resourceRoleAdd({ key, data/* , user*/ }) {
      for (const roleId of data.roles) {
        await this.ctx.bean.resource.addResourceRole({ atomId: key.atomId, roleId });
      }
    }

  }

  return Resource;
};
