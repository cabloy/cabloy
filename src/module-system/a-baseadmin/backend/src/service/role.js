module.exports = class Role {
  async childrenTop({ roleTypes, page, user }) {
    return await this.ctx.bean.role.childrenTop({ roleTypes, page, user });
  }

  async children({ roleTypes, roleId, page, user }) {
    return await this.ctx.bean.role.children({ roleTypes, roleId, page, user });
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

  async roleUsers({ roleAtomId, page, user }) {
    return await this.ctx.bean.role.roleUsers({ roleAtomId, page, user });
  }

  async addUserRole({ roleAtomId, userId, user }) {
    return await this.ctx.bean.role.addUserRole({ roleAtomId, userId, user });
  }

  async deleteUserRole({ roleAtomId, userId, user }) {
    return await this.ctx.bean.role.deleteUserRole({ roleAtomId, userId, user });
  }

  async includes({ roleAtomId, page, user }) {
    return await this.ctx.bean.role.includes({ roleAtomId, page, user });
  }

  async addRoleInc({ roleAtomId, roleIdInc, user }) {
    const res = await this.ctx.bean.role.addRoleInc({ roleAtomId, roleIdInc, user });
    const progressId = await this._tailBuild();
    return { ...res, progressId };
  }

  async removeRoleInc({ roleAtomId, roleIdInc, user }) {
    await this.ctx.bean.role.removeRoleInc({ roleAtomId, roleIdInc, user });
    const progressId = await this._tailBuild();
    return { progressId };
  }

  async _tailBuild() {
    const progressId = await this.ctx.bean.progress.create();
    // build, not await
    this.ctx.bean.role.build({ progressId });
    return progressId;
  }
};
