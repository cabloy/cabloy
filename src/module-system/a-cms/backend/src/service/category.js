module.exports = app => {

  class Category extends app.Service {

    async children({ language, categoryId }) {
      const list = await this.ctx.model.category.select({
        where: {
          language,
          categoryIdParent: categoryId,
        },
        orders: [[ 'sorting', 'asc' ], [ 'createdAt', 'asc' ]],
      });
      return list;
    }

    async add({ categoryName, language, categoryIdParent }) {
      // add
      const res = await this.ctx.model.category.insert({
        categoryName,
        language,
        catalog: 0,
        hidden: 0,
        sorting: 0,
        categoryIdParent,
      });

      // update parent's catalog
      if (categoryIdParent) {
        await this.ctx.model.category.update({
          id: categoryIdParent,
          catalog: 1,
        });
      }

      return res.insertId;
    }

    async delete({ categoryId }) {
      // category
      const category = await this.ctx.model.category.get({ id: categoryId });
      // parent
      let categoryParent;
      if (category.categoryIdParent) {
        categoryParent = await this.ctx.model.category.get({
          id: category.categoryIdParent,
        });
      }
      // delete
      await this.ctx.model.category.delete({ id: categoryId });
      // update parent's catalog
      if (categoryParent) {
        const list = await this.ctx.model.category.select({
          where: {
            categoryIdParent: categoryParent.id,
          },
        });
        if (list.length === 0) {
          await this.ctx.model.category.update({
            id: categoryParent.id,
            catalog: 0,
          });
        }
      }
    }

  }

  return Category;
};
