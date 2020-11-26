module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Category {

    get modelCategory() {
      return ctx.model.module(moduleInfo.relativeName).category;
    }

    async item({ categoryId }) {
      return await this.modelCategory.get({ id: categoryId });
    }

    async save({ categoryId, data }) {
      await this.modelCategory.update({
        id: categoryId,
        categoryName: data.categoryName,
        categoryHidden: data.categoryHidden,
        categorySorting: data.categorySorting,
        categoryFlag: data.categoryFlag,
        categoryUrl: data.categoryUrl,
      });
    }

    async count({ atomClass, categoryLanguage, categoryId, categoryHidden, categoryFlag }) {
      return await this.children({ atomClass, categoryLanguage, categoryId, categoryHidden, categoryFlag, count: 1 });
    }

    async child({ atomClass, categoryLanguage, categoryId, categoryName, categoryHidden, categoryFlag }) {
      const list = await this.children({ atomClass, categoryLanguage, categoryId, categoryName, categoryHidden, categoryFlag });
      return list[0];
    }

    async children({ atomClass, categoryLanguage, categoryId, categoryName, categoryHidden, categoryFlag, count = 0 }) {
      //
      const where = { };
      if (count) {
        if (categoryId !== undefined) where.categoryIdParent = categoryId;
      } else {
        where.categoryIdParent = categoryId || 0;
      }
      // atomClassId
      if (!where.categoryIdParent) {
        // atomClass
        atomClass = await ctx.bean.atomClass.get(atomClass);
        where.atomClassId = atomClass.id;
      }
      //
      if (categoryLanguage !== undefined) where.categoryLanguage = categoryLanguage;
      if (categoryName !== undefined) where.categoryName = categoryName;
      if (categoryHidden !== undefined) where.categoryHidden = categoryHidden;
      if (categoryFlag !== undefined) where.categoryFlag = categoryFlag;
      //
      if (count) {
        return await this.modelCategory.count(where);
      }
      return await this.modelCategory.select({
        where,
        orders: [[ 'categorySorting', 'asc' ], [ 'createdAt', 'asc' ]],
      });
    }

    async add({ atomClass, data }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // add
      const res = await this.modelCategory.insert({
        atomClassId: atomClass.id,
        categoryLanguage: data.categoryLanguage,
        categoryName: data.categoryName,
        categoryCatalog: 0,
        categoryHidden: 0,
        categorySorting: 0,
        categoryIdParent: data.categoryIdParent,
      });
      // adjust catalog
      await this.adjustCatalog(data.categoryIdParent);
      return res.insertId;
    }

    async delete({ categoryId }) {
      // check atoms
      const count = await ctx.bean.atom.modelAtom.count({ atomCategoryId: categoryId });
      if (count > 0) ctx.throw.module(moduleInfo.relativeName, 1012);
      // check children
      const children = await this.children({ categoryId });
      if (children.length > 0) ctx.throw.module(moduleInfo.relativeName, 1013);

      // category
      const category = await this.modelCategory.get({ id: categoryId });
      // parent
      const categoryIdParent = category.categoryIdParent;

      // delete
      await this.modelCategory.delete({ id: categoryId });
      // adjust catalog
      await this.adjustCatalog(categoryIdParent);
    }

    async move({ categoryId, categoryIdParent }) {
      // category
      const category = await this.modelCategory.get({ id: categoryId });
      // categoryIdParentOld
      const categoryIdParentOld = category.categoryIdParent;
      // move
      await this.modelCategory.update({
        id: categoryId,
        categoryIdParent,
      });
      // adjust catalog
      await this.adjustCatalog(categoryIdParentOld);
      await this.adjustCatalog(categoryIdParent);
    }

    // for donothing on categoryId === 0, so need not input param:atomClass
    async adjustCatalog(categoryId) {
      if (categoryId === 0) return;
      const children = await this.children({ categoryId });
      await this.modelCategory.update({
        id: categoryId,
        categoryCatalog: children.length === 0 ? 0 : 1,
      });
    }

    async tree({ atomClass, categoryLanguage, categoryId, categoryHidden, categoryFlag }) {
      return await this._treeChildren({ atomClass, categoryLanguage, categoryId, categoryHidden, categoryFlag });
    }

    async _treeChildren({ atomClass, categoryLanguage, categoryId, categoryHidden, categoryFlag }) {
      const list = await this.children({ atomClass, categoryLanguage, categoryId, categoryHidden, categoryFlag });
      for (const item of list) {
        if (item.categoryCatalog) {
          // only categoryId
          item.children = await this._treeChildren({ atomClass, categoryId: item.id });
        }
      }
      return list;
    }

    async relativeTop({ categoryId }) {
      return await this._relativeTop({ categoryId });
    }

    async _relativeTop({ categoryId }) {
      if (categoryId === 0) return null;
      const category = await this.item({ categoryId });
      if (!category) return null;
      if (category.categoryUrl) return category;
      return await this._relativeTop({ categoryId: category.categoryIdParent });
    }

    // categoryA.categoryB
    async parseCategoryName({ atomClass, categoryLanguage, categoryName, categoryIdParent = 0, force = false }) {
      const categoryNames = categoryName.split('.');
      let category;
      for (const _categoryName of categoryNames) {
        category = await this.child({
          atomClass, categoryLanguage,
          categoryId: categoryIdParent,
          categoryName: _categoryName,
        });
        // next
        if (category) {
          categoryIdParent = category.id;
          continue;
        }
        // null
        if (!force) return null;
        // create
        const categoryId = await this._register({
          atomClass, categoryLanguage,
          categoryName: _categoryName,
          categoryIdParent,
        });
        category = await this.item({ categoryId });
        // next
        categoryIdParent = categoryId;
      }
      return category;
    }

    async _register({ atomClass, categoryLanguage, categoryName, categoryIdParent }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.category.register.${atomClass.id}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'category',
            context: { atomClass, categoryLanguage, categoryName, categoryIdParent },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ atomClass, categoryLanguage, categoryName, categoryIdParent }) {
      // get again
      const category = await this.child({
        atomClass,
        categoryLanguage,
        categoryId: categoryIdParent,
        categoryName,
      });
      if (category) return category.id;
      // add
      return await this.add({
        atomClass,
        data: {
          categoryLanguage,
          categoryName,
          categoryIdParent,
        },
      });
    }

  }
  return Category;
};
