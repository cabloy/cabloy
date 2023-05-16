module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Role {
    // set dirty
    async setDirty(dirty) {
      // when build done, clear summer
      if (!dirty) {
        await ctx.bean.atom.clearSummer_roleScopesOfUser();
      }
      // status
      await ctx.bean.status.module(moduleInfo.relativeName).set('roleDirty', dirty);
    }

    async getDirty() {
      return await ctx.bean.status.module(moduleInfo.relativeName).get('roleDirty');
    }

    // build roles
    async build(options) {
      options = options || {};
      const progressId = options.progressId;
      // check dirty
      const dirty = await this.getDirty();
      if (!dirty) {
        // done
        if (progressId) {
          await ctx.bean.progress.done({ progressId });
        }
        return;
      }
      // queue
      await ctx.meta.util.queuePushAsync({
        module: moduleInfo.relativeName,
        queueName: 'roleBuild',
        data: { options },
      });
    }

    async _buildQueue(options) {
      options = options || {};
      const progressId = options.progressId;
      // check dirty again
      const dirty = await this.getDirty();
      if (!dirty) {
        // done
        if (progressId) {
          await ctx.bean.progress.done({ progressId });
        }
        return;
      }
      // total
      let total;
      if (progressId) {
        total = await this.model.count();
      }
      // progress
      const progress = { progressId, total, progress: 0 };
      try {
        // iid
        const iid = ctx.instance.id;
        // remove
        await this._buildRolesRemove({ iid });
        // add
        await this._buildRolesAdd({ iid, roleIdParent: 0 }, progress);
        // setDirty
        await this.setDirty(false);
        // done
        if (progressId) {
          await ctx.bean.progress.done({ progressId });
        }
      } catch (err) {
        // error
        if (progressId) {
          await ctx.bean.progress.error({ progressId, message: err.message });
        }
        throw err;
      }
    }

    async _buildRolesRemove({ iid }) {
      await ctx.model.query(`delete from aRoleRef where aRoleRef.iid=${iid}`);
      await ctx.model.query(`delete from aRoleIncRef where aRoleIncRef.iid=${iid}`);
      await ctx.model.query(`delete from aRoleExpand where aRoleExpand.iid=${iid}`);
    }

    async _buildRolesAdd({ iid, roleIdParent }, progress) {
      const list = await ctx.model.query(
        `select a.id,a.roleName,a.catalog,a.atomId from aRole a where a.iid=${iid} and a.roleIdParent=${roleIdParent}`
      );
      for (const item of list) {
        // info
        const roleId = item.id;
        const roleAtomId = item.atomId;
        const catalog = item.catalog;
        // build
        await this._buildRoleRef({ iid, roleId });
        await this._buildRoleIncRef({ iid, roleId });
        await this._buildRoleExpand({ iid, roleId, roleAtomId });
        // catalog
        if (catalog === 1) {
          await this._buildRolesAdd({ iid, roleIdParent: roleId }, progress);
        }
        // progress
        if (progress.progressId) {
          await ctx.bean.progress.update({
            progressId: progress.progressId,
            progressNo: 0,
            total: progress.total,
            progress: progress.progress++,
            text: item.roleName,
          });
        }
      }
    }

    async _buildRoleRef({ iid, roleId }) {
      let level = 0;
      let roleIdParent = roleId;
      // loop
      while (level !== -1) {
        await ctx.model.query(
          `insert into aRoleRef(iid,roleId,roleIdParent,level)
             values(${iid},${roleId},${roleIdParent},${level})
          `
        );
        const item = await ctx.model.queryOne(
          `select a.roleIdParent from aRole a where a.iid=${iid} and a.id=${roleIdParent}`
        );
        if (!item || !item.roleIdParent) {
          level = -1;
        } else {
          roleIdParent = item.roleIdParent;
          level++;
        }
      }
    }

    async _buildRoleIncRef({ iid, roleId }) {
      await ctx.model.query(
        `insert into aRoleIncRef(iid,roleId,roleIdInc,roleIdSrc)
            select ${iid},${roleId},a.roleIdInc,a.roleId from aRoleInc a
              where a.iid=${iid} and a.roleId in (select b.roleIdParent from aRoleRef b where b.iid=${iid} and b.roleId=${roleId})
        `
      );
    }

    async _buildRoleExpand({ iid, roleId, roleAtomId }) {
      await ctx.model.query(
        `insert into aRoleExpand(iid,roleAtomId,roleId,roleIdBase)
            select a.iid,${roleAtomId},a.roleId,a.roleIdParent from aRoleRef a
              where a.iid=${iid} and a.roleId=${roleId}
        `
      );
      await ctx.model.query(
        `insert into aRoleExpand(iid,roleAtomId,roleId,roleIdBase)
            select a.iid,${roleAtomId},a.roleId,a.roleIdInc from aRoleIncRef a
              where a.iid=${iid} and a.roleId=${roleId}
        `
      );
    }
  }

  return Role;
};
