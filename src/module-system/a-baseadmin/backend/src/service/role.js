module.exports = app => {
  class Role extends app.Service {
    async childrenTop({ page, user }) {
      return await this.ctx.bean.role.childrenTop({ page, user });
    }

    async children({ roleId, page, user }) {
      return await this.ctx.bean.role.children({ roleId, page, user });
    }

    async item({ roleId }) {
      return await this.ctx.bean.role.get({ id: roleId });
    }

    async save({ roleId, data }) {
      return await this.ctx.bean.role.save({ roleId, data });
    }

    async add({ roleIdParent }) {
      const res = await this.ctx.bean.role.add({ roleIdParent });
      await this.ctx.bean.role.build();
      return res;
    }

    async move({ roleId, roleIdParent }) {
      return await this.ctx.bean.role.move({ roleId, roleIdParent });
    }

    async delete({ roleId }) {
      return await this.ctx.bean.role.delete({ roleId });
    }

    async includes({ roleId, page }) {
      return await this.ctx.bean.role.includes({ roleId, page });
    }

    async addRoleInc({ roleId, roleIdInc }) {
      return await this.ctx.bean.role.addRoleInc({ roleId, roleIdInc });
    }

    async removeRoleInc({ id }) {
      return await this.ctx.bean.role.removeRoleInc({ id });
    }

    async dirty() {
      return await this.ctx.bean.role.getDirty();
    }

    async buildBulk() {
      const progressId = await this.ctx.bean.progress.create();
      // build, not await
      this.ctx.bean.role.build({ progressId });
      // ok
      return { progressId };
    }
  }

  return Role;
};
