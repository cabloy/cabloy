const utils = require('../common/utils.js');

module.exports = app => {

  class Category extends app.Service {

    async item({ categoryId }) {
      return await this.ctx.model.category.get({ id: categoryId });
    }

    async save({ categoryId, data }) {
      await this.ctx.model.category.update({
        id: categoryId,
        categoryName: data.categoryName,
        hidden: data.hidden,
        sorting: data.sorting,
        flag: data.flag,
        url: data.url,
      });
      // only in development
      await this._rebuild({ categoryId });
    }

    async count({ atomClass, language, categoryId, hidden, flag }) {
      return await this.children({ atomClass, language, categoryId, hidden, flag, count: 1 });
    }

    async children({ atomClass, language, categoryId, hidden, flag, count = 0 }) {
      //
      const where = { };
      if (count) {
        if (categoryId !== undefined) where.categoryIdParent = categoryId;
      } else {
        where.categoryIdParent = categoryId || 0;
      }
      // atomClassId
      if (!where.categoryIdParent) {
        const _atomClass = await utils.atomClass2(this.ctx, atomClass);
        where.atomClassId = _atomClass.id;
      }
      //
      if (language !== undefined) where.language = language;
      if (hidden !== undefined) where.hidden = hidden;
      if (flag !== undefined) where.flag = flag;
      //
      if (count) {
        return await this.ctx.model.category.count(where);
      }
      return await this.ctx.model.category.select({
        where,
        orders: [[ 'sorting', 'asc' ], [ 'createdAt', 'asc' ]],
      });
    }

    async add({ atomClass, data }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      // add
      const res = await this.ctx.model.category.insert({
        categoryName: data.categoryName,
        language: data.language,
        catalog: 0,
        hidden: 0,
        sorting: 0,
        categoryIdParent: data.categoryIdParent,
        atomClassId: _atomClass.id,
      });
      // adjust catalog
      await this.adjustCatalog(data.categoryIdParent);
      // only in development
      await this._rebuild({ categoryId: res.insertId });

      return res.insertId;
    }

    async delete({ categoryId }) {
      // check articles
      const count = await this.ctx.model.article.count({ categoryId });
      if (count > 0) this.ctx.throw(1005);
      // check children
      const children = await this.children({ categoryId });
      if (children.length > 0) this.ctx.throw(1004);

      // category
      const category = await this.ctx.model.category.get({ id: categoryId });
      // parent
      const categoryIdParent = category.categoryIdParent;

      // delete
      await this.ctx.model.category.delete({ id: categoryId });
      // adjust catalog
      await this.adjustCatalog(categoryIdParent);

      // only in development
      if (this.ctx.app.meta.isLocal) {
        const atomClass = await this.ctx.bean.atomClass.get({ id: category.atomClassId });
        await this._rebuild({ atomClass, language: category.language });
      }
    }

    async move({ categoryId, categoryIdParent }) {
      // category
      const category = await this.ctx.model.category.get({ id: categoryId });
      // categoryIdParentOld
      const categoryIdParentOld = category.categoryIdParent;
      // move
      await this.ctx.model.category.update({
        id: categoryId,
        categoryIdParent,
      });
      // adjust catalog
      await this.adjustCatalog(categoryIdParentOld);
      await this.adjustCatalog(categoryIdParent);
      // only in development
      await this._rebuild({ categoryId });
    }

    // for donothing on categoryId === 0, so need not input param:atomClass
    async adjustCatalog(categoryId) {
      if (categoryId === 0) return;
      const children = await this.children({ categoryId });
      await this.ctx.model.category.update({
        id: categoryId,
        catalog: children.length === 0 ? 0 : 1,
      });
    }

    async tree({ atomClass, language, categoryId, hidden, flag }) {
      return await this._treeChildren({ atomClass, language, categoryId, hidden, flag });
    }

    async _treeChildren({ atomClass, language, categoryId, hidden, flag }) {
      const list = await this.children({ atomClass, language, categoryId, hidden, flag });
      for (const item of list) {
        if (item.catalog) {
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
      const category = await this.item({ categoryId });
      if (!category) return null;
      if (category.url) return category;
      return await this._relativeTop({ categoryId: category.categoryIdParent });
    }

    async _rebuild({ categoryId, atomClass, language }) {
      // only in development
      if (this.ctx.app.meta.isLocal) {
        // atomClass
        const item = categoryId ? await this.ctx.model.category.get({ id: categoryId }) : null;
        const _atomClass = atomClass || await this.ctx.bean.atomClass.get({ id: item.atomClassId });
        // build site
        this.ctx.service.site.buildLanguageQueue({ atomClass: _atomClass, language: language || item.language });
      }
    }

  }

  return Category;
};
