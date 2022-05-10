module.exports = app => {
  class Resource extends app.Service {
    async select({ atomClass, options, user }) {
      return await this.ctx.bean.resource.select({ atomClass, options, user });
    }

    async read({ atomStaticKey, options, user }) {
      return await this.ctx.bean.resource.readByStaticKey({ atomStaticKey, options, user });
    }

    async check({ atomStaticKeys, user }) {
      return await this.ctx.bean.resource.check({ atomStaticKeys, user });
    }

    async resourceRoles({ key, user }) {
      return await this.ctx.bean.resource.resourceRoles({ key, user });
    }

    async resourceRoleRemove({ key, data, user }) {
      return await this.ctx.bean.resource.deleteResourceRole({
        atomId: key.atomId,
        roleId: data.roleId,
        user,
      });
    }

    async resourceRoleAdd({ key, data, user }) {
      for (const roleId of data.roles) {
        await this.ctx.bean.resource.addResourceRole({ atomId: key.atomId, roleId, user });
      }
    }
  }

  return Resource;
};
