module.exports = app => {
  const moduleInfo = module.info;
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-community-writer to template
        const roles = ['cms-community-writer'];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        const roleActivated = await this.ctx.bean.role.getSystemRole({ roleName: 'activated' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-community
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
          // role:activated include cms-community-writer
          if (roleName === 'cms-community-writer') {
            await this.ctx.bean.role.addRoleInc({ roleId: roleActivated.id, roleIdInc: roleId });
          }
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-community-writer', action: 'create' },
          { roleName: 'cms-community-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-community-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'deleteBulk' },
          { roleName: 'cms-community-writer', action: 'exportBulk' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'post', roleRights });
      }

      if (options.version === 2) {
        // add role rights
        const roleRights = [
          { roleName: 'root', action: 'layout', scopeNames: 'root' }, //
          { roleName: 'root', action: 'preview', scopeNames: 'root' }, //
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'post', roleRights });
      }
    }

    async test() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'post',
      };
      const categories = [
        // en-us
        { categoryName: 'Share', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: 'Answer', language: 'en-us', categoryIdParent: 0, categorySorting: 2 },
        { categoryName: 'Announcement', language: 'en-us', categoryIdParent: 0, categorySorting: 3 },
        // zh-cn
        { categoryName: '分享', language: 'zh-cn', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: '问答', language: 'zh-cn', categoryIdParent: 0, categorySorting: 2 },
        { categoryName: '公告', language: 'zh-cn', categoryIdParent: 0, categorySorting: 3 },
      ];
      const categoryIds = {};
      for (const item of categories) {
        // add
        const categoryId = await this.ctx.bean.category.add({
          atomClass,
          data: {
            language: item.language,
            categoryName: item.categoryName,
            categoryHidden: item.categoryHidden,
            categorySorting: item.categorySorting,
            categoryFlag: item.categoryFlag,
            categoryIdParent: item.categoryIdParent ? categoryIds[item.categoryIdParent] : 0,
          },
        });
        categoryIds[item.categoryName] = categoryId;
      }
    }
  }

  return Version;
};
