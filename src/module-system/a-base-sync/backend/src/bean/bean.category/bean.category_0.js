module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Category {
    get modelCategory() {
      return ctx.model.module(moduleInfo.relativeName).category;
    }

    async get({ categoryId, setLocale }) {
      const category = await this.modelCategory.get({ id: categoryId });
      if (category && setLocale) {
        category.categoryNameLocale = ctx.text(category.categoryName);
      }
      return category;
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

    async count({ atomClass, language, categoryId, categoryHidden, categoryFlag, user }) {
      return await this.children({ atomClass, language, categoryId, categoryHidden, categoryFlag, user, count: 1 });
    }

    async child({ atomClass, language, categoryId, categoryName, categoryHidden, categoryFlag, setLocale, user }) {
      const list = await this.children({
        atomClass,
        language,
        categoryId,
        categoryName,
        categoryHidden,
        categoryFlag,
        setLocale,
        user,
      });
      return list[0];
    }

    async children({
      atomClass,
      language,
      categoryId,
      categoryName,
      categoryHidden,
      categoryFlag,
      setLocale,
      count = 0,
      user,
    }) {
      // categoryHidden
      categoryHidden = await this._checkRightForCategoryHidden({ categoryHidden, user });
      // where
      const where = {};
      if (categoryId !== undefined) where.categoryIdParent = categoryId;
      // atomClassId
      if (!where.categoryIdParent) {
        // atomClass
        atomClass = await ctx.bean.atomClass.get(atomClass);
        where.atomClassId = atomClass.id;
      }
      //
      if (language) where.language = language; // not check !== undefined
      if (categoryName !== undefined) where.categoryName = categoryName;
      if (categoryHidden !== undefined) where.categoryHidden = categoryHidden;
      if (categoryFlag !== undefined) where.categoryFlag = categoryFlag;
      //
      if (count) {
        return await this.modelCategory.count(where);
      }
      const list = await this.modelCategory.select({
        where,
        orders: [
          ['categorySorting', 'asc'],
          ['createdAt', 'asc'],
        ],
      });
      if (setLocale) {
        for (const category of list) {
          category.categoryNameLocale = ctx.text(category.categoryName);
        }
      }
      return list;
    }

    async add({ atomClass, data }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // add
      const res = await this.modelCategory.insert({
        atomClassId: atomClass.id,
        language: data.language,
        categoryName: data.categoryName,
        categoryHidden: data.categoryHidden || 0,
        categorySorting: data.categorySorting || 0,
        categoryFlag: data.categoryFlag,
        categoryUrl: data.categoryUrl,
        categoryIdParent: data.categoryIdParent,
        categoryCatalog: 0,
      });
      // adjust catalog
      await this.adjustCatalog(data.categoryIdParent);
      return res.insertId;
    }

    async delete({ categoryId }) {
      // check atoms
      const count = await ctx.bean.atom.modelAtom.count({ atomCategoryId: categoryId });
      if (count > 0) {
        ctx.throw.module(moduleInfo.relativeName, 1012);
      }
      // check children
      const children = await this.children({ categoryId });
      if (children.length > 0) {
        ctx.throw.module(moduleInfo.relativeName, 1013);
      }

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
      if (categoryIdParentOld === categoryIdParent) return;
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

    async tree({ atomClass, language, categoryId, categoryHidden, categoryFlag, setLocale, user }) {
      // categoryHidden
      categoryHidden = await this._checkRightForCategoryHidden({ categoryHidden, user });
      // categoryId
      if (categoryId === undefined) categoryId = 0;
      return await this._treeChildren({ atomClass, language, categoryId, categoryHidden, categoryFlag, setLocale });
    }

    async _treeChildren({ atomClass, language, categoryId, categoryHidden, categoryFlag, setLocale }) {
      const list = await this.children({ atomClass, language, categoryId, categoryHidden, categoryFlag, setLocale });
      for (const item of list) {
        if (item.categoryCatalog) {
          // only categoryId
          item.children = await this._treeChildren({
            atomClass,
            language,
            categoryId: item.id,
            categoryHidden,
            categoryFlag,
            setLocale,
          });
        }
      }
      return list;
    }

    async relativeTop({ categoryId, setLocale }) {
      return await this._relativeTop({ categoryId, setLocale });
    }

    async _relativeTop({ categoryId, setLocale }) {
      if (categoryId === 0) return null;
      const category = await this.get({ categoryId, setLocale });
      if (!category) return null;
      if (category.categoryUrl) return category;
      return await this._relativeTop({ categoryId: category.categoryIdParent, setLocale });
    }

    // categoryA.categoryB
    async parseCategoryName({ atomClass, language, categoryName, categoryIdParent = 0, force = false }) {
      const categoryNames = categoryName.split('.');
      let category;
      for (const _categoryName of categoryNames) {
        category = await this.child({
          atomClass,
          language,
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
          atomClass,
          language,
          categoryName: _categoryName,
          categoryIdParent,
        });
        category = await this.get({ categoryId });
        // next
        categoryIdParent = categoryId;
      }
      return category;
    }

    async _register({ atomClass, language, categoryName, categoryIdParent }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.category.register.${atomClass.id}`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'category',
            context: { atomClass, language, categoryName, categoryIdParent },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ atomClass, language, categoryName, categoryIdParent }) {
      // get again
      const category = await this.child({
        atomClass,
        language,
        categoryId: categoryIdParent,
        categoryName,
      });
      if (category) return category.id;
      // add
      return await this.add({
        atomClass,
        data: {
          language,
          categoryName,
          categoryIdParent,
        },
      });
    }

    async _checkRightForCategoryHidden({ categoryHidden, user }) {
      if (!user || user.id === 0) return categoryHidden;
      if (categoryHidden === 0) return categoryHidden;
      const res = await ctx.bean.resource.checkRightResource({
        atomStaticKey: 'a-settings:settings',
        user,
      });
      return res ? categoryHidden : 0;
    }
  }
  return Category;
};
