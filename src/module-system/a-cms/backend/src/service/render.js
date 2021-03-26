module.exports = app => {

  class Render extends app.Service {

    async getArticleUrl({ atomClass, key }) {
      return await this.ctx.bean.cms.render.getArticleUrl({ atomClass, key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      return await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite });
    }

  }

  return Render;
};
