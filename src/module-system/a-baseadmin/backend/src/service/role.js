module.exports = app => {
  class Role extends app.Service {
    async childrenTop({ page, user }) {
      return await this.ctx.bean.role.childrenTop({ page, user });
    }

    async children({ roleId, page, user }) {
      return await this.ctx.bean.role.children({ roleId, page, user });
    }

    async delete({ roleAtomId, user }) {
      await this.ctx.bean.role.delete({ roleAtomId, user });
      const progressId = await this._tailBuild();
      return { progressId };
    }

    async clone({ roleAtomId, user }) {
      const res = await this.ctx.bean.role.clone({ roleAtomId, user });
      const progressId = await this._tailBuild();
      return { ...res, progressId };
    }

    async move({ roleAtomId, roleIdParent, user }) {
      await this.ctx.bean.role.move({ roleAtomId, roleIdParent, user });
      const progressId = await this._tailBuild();
      return { progressId };
    }

    async addChild({ roleAtomId, user }) {
      const res = await this.ctx.bean.role.addChild({ roleAtomId, user });
      const progressId = await this._tailBuild();
      return { ...res, progressId };
    }

    async includes({ roleAtomId, page, user }) {
      return await this.ctx.bean.role.includes({ roleAtomId, page, user });
    }

    // ////////////////

    async item({ roleAtomId, roleId }) {
      return await this.ctx.bean.role.item({ roleAtomId, roleId });
    }

    async save({ roleId, data }) {
      return await this.ctx.bean.role.save({ roleId, data });
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
      const progressId = await this._tailBuild();
      // ok
      return { progressId };
    }

    async _tailBuild() {
      const progressId = await this.ctx.bean.progress.create();
      // build, not await
      this.ctx.bean.role.build({ progressId });
      return progressId;
    }
  }

  return Role;
};
