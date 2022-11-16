module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassResource = {
    module: 'a-base',
    atomClassName: 'resource',
  };
  class VersionUpdate19 {
    get modelAtom() {
      return ctx.model.module(moduleInfo.relativeName).atom;
    }

    async run() {
      // adjustCategories
      await this._adjustCategories({ resourceType: 'a-base:menu' });
      await this._adjustCategories({ resourceType: 'a-base:mine' });
    }

    async _adjustCategories({ resourceType }) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: {
            resourceType,
          },
          fn: 'update19_adjustCategories',
        });
      }
    }

    async _adjustCategoriesInstance({ resourceType }) {
      // select all resources
      const list = await ctx.bean.resource.select({
        options: {
          where: {
            resourceType,
          },
          orders: [['a.id', 'asc']],
          page: { index: 0, size: 0 },
          locale: false,
        },
      });
      // patch
      for (const item of list) {
        const appKey = item.appKey || 'a-appbooster:appUnclassified';
        const categoryNames = [resourceType, appKey, item.atomCategoryName].join('.');
        const category = await ctx.bean.category.parseCategoryName({
          atomClass: __atomClassResource,
          language: item.atomLanguage,
          categoryName: categoryNames,
          force: true,
        });
        if (category.id !== item.atomCategoryId) {
          // formal
          await this.modelAtom.update({
            id: item.atomId,
            atomCategoryId: category.id,
          });
          // draft/history
          await this.modelAtom.update(
            {
              atomCategoryId: category.id,
            },
            {
              where: {
                atomIdFormal: item.atomId,
              },
            }
          );
        }
      }
      // delete all old categories
      const categoryTop = await ctx.bean.category.child({
        atomClass: __atomClassResource,
        categoryId: 0,
        categoryName: resourceType,
      });
      const children = await ctx.bean.category.children({
        atomClass: __atomClassResource,
        categoryId: categoryTop.id,
        setLocale: false,
      });
      for (const child of children) {
        if (child.categoryName.indexOf(':') === -1) {
          await this._deleteCategory(child);
        }
      }
    }

    async _deleteCategory(category) {
      try {
        await ctx.bean.category.delete({ categoryId: category.id });
      } catch (err) {
        // donot throw error
        ctx.logger.info(`categoryId: ${category.id}, categoryName: ${category.categoryName}`);
      }
    }
  }

  return VersionUpdate19;
};
