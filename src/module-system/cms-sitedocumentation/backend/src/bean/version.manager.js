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
        // create roles: cms-documentation-writer to template
        const roles = ['cms-documentation-writer'];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-documentation
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-documentation-writer', action: 'create' },
          { roleName: 'cms-documentation-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-documentation-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'deleteBulk' },
          { roleName: 'cms-documentation-writer', action: 'exportBulk' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
          { roleName: 'root', action: 'layout', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'preview', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'document', roleRights });
      }
    }

    async test() {
      await this._test_categories_tags();
    }

    async _test_categories_tags() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'document',
      };
      // categories
      const categories = [
        // en-us
        { categoryName: 'test1', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2-1', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test2-2', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test3', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: 'testHidden', language: 'en-us', categoryIdParent: 0, categoryHidden: 1 },
        { categoryName: 'testFlag', language: 'en-us', categoryIdParent: 0, categoryFlag: 'Flag' },
        // zh-cn
        { categoryName: '目录1', language: 'zh-cn', categoryIdParent: 0 },
        { categoryName: '目录2', language: 'zh-cn', categoryIdParent: 0 },
        { categoryName: '目录2-1', language: 'zh-cn', categoryIdParent: '目录2' },
        { categoryName: '目录2-2', language: 'zh-cn', categoryIdParent: '目录2' },
        { categoryName: '目录3', language: 'zh-cn', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: '隐藏目录', language: 'zh-cn', categoryIdParent: 0, categoryHidden: 1 },
        { categoryName: '加标记的目录', language: 'zh-cn', categoryIdParent: 0, categoryFlag: 'Flag' },
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
      // tags
      const tags = [
        // en-us
        { tagName: 'Life', language: 'en-us' },
        { tagName: 'Study', language: 'en-us' },
        { tagName: 'Work', language: 'en-us' },
        // zh-cn
        { tagName: '生活', language: 'zh-cn' },
        { tagName: '学习', language: 'zh-cn' },
        { tagName: '工作', language: 'zh-cn' },
      ];
      const tagIds = {};
      for (const item of tags) {
        // add
        const tagId = await this.ctx.bean.tag.add({
          atomClass,
          data: {
            language: item.language,
            tagName: item.tagName,
          },
        });
        tagIds[item.tagName] = tagId;
      }
    }
  }

  return Version;
};
