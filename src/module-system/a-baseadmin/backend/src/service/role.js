module.exports = app => {

  class Role extends app.Service {

    async children({ roleId, page }) {
      return await this.ctx.meta.role.children({ roleId, page });
    }

    async item({ roleId }) {
      return await this.ctx.meta.role.get({ id: roleId });
    }

    async save({ roleId, data }) {
      return await this.ctx.meta.role.save({ roleId, data });
    }

    async add({ roleIdParent, catalog }) {
      return await this.ctx.meta.role.add({ roleIdParent, catalog });
    }

    async move({ roleId, roleIdParent }) {
      return await this.ctx.meta.role.move({ roleId, roleIdParent });
    }

    async delete({ roleId }) {
      return await this.ctx.meta.role.delete({ roleId });
    }

    async includes({ roleId, page }) {
      return await this.ctx.meta.role.includes({ roleId, page });
    }

    async addRoleInc({ roleId, roleIdInc }) {
      return await this.ctx.meta.role.addRoleInc({ roleId, roleIdInc });
    }

    async removeRoleInc({ id }) {
      return await this.ctx.meta.role.removeRoleInc({ id });
    }

    async dirty() {
      return await this.ctx.meta.role.getDirty();
    }

    async build() {
      const progressId = await this.ctx.meta.progress.create();
      this.ctx.performActionInBackground({
        method: 'post',
        url: 'role/buildInBackground',
        body: {
          progressId,
        },
      });
      return { progressId };
    }

    async buildInBackground({ progressId }) {
      return await this.ctx.meta.role.build({ progressId });
    }

  }

  return Role;
};
