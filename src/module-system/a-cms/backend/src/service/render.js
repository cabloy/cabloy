const Build = require('../common/build.js');

module.exports = app => {

  class Render extends app.Service {

    async renderArticle({ atomClass, key, inner }) {
      const build = Build.create(this.ctx, atomClass);
      await build.renderArticle({ key, inner });
    }

    async deleteArticle({ atomClass, key, article, inner }) {
      const build = Build.create(this.ctx, atomClass);
      await build.deleteArticle({ key, article, inner });
    }

    async getArticleUrl({ atomClass, key }) {
      if (!atomClass) {
        atomClass = await this.ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = Build.create(this.ctx, atomClass);
      return await build.getArticleUrl({ key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.combineSiteBase();
    }

  }

  return Render;
};
