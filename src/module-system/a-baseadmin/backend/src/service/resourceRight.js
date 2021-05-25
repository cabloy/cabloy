module.exports = app => {

  class ResourceRight extends app.Service {

    async rights({ roleId, page }) {
      return await this.ctx.bean.resource.resourceRights({ roleId, page });
    }

    async add({ roleId, atomIds }) {
      return await this.ctx.bean.resource.addResourceRoles({ roleId, atomIds });
    }

    async delete({ id }) {
      return await this.ctx.bean.resource.deleteResourceRole({ id });
    }

    async spreads({ roleId, page }) {
      return await this.ctx.bean.resource.resourceSpreads({ roleId, page });
    }

  }

  return ResourceRight;
};
