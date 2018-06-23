module.exports = app => {

  class FunctionRight extends app.Service {

    async rights({ menu, roleId, page }) {
      return await this.ctx.meta.role.functionRights({ menu, roleId, page });
    }

    async add({ roleId, module, name }) {
      const func = await this.ctx.meta.function.get({ module, name });
      if (func.autoRight) {
        return await this.ctx.meta.role.addRoleRight({
          roleId,
          atomClassId: func.atomClassId,
          action: func.action,
          scope: 0,
        });
      }
      return await this.ctx.meta.role.addRoleFunction({
        roleId,
        functionId: func.id,
        roleRightId: 0,
      });
    }

    async delete({ id }) {
      const sql = `
        select a.*,b.* from aRoleFunction a 
          left join aFunction b on a.functionId=b.id 
            where a.iid=? and a.id=?
      `;
      const roleFunction = await this.ctx.model.queryOne(sql, [ this.ctx.instance.id, id ]);
      if (roleFunction.autoRight) {
        return await this.ctx.meta.role.deleteRoleRight({ id: roleFunction.roleRightId });
      }
      return await this.ctx.meta.role.deleteRoleFunction({ id });
    }

    async spreads({ menu, roleId, page }) {
      return await this.ctx.meta.role.functionSpreads({ menu, roleId, page });
    }

  }

  return FunctionRight;
};
