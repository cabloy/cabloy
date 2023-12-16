module.exports = class Render {
  async getArticleUrl({ atomClass, key, options }) {
    return await this.ctx.bean.cms.render.getArticleUrl({ atomClass, key, options });
  }

  // site<plugin<theme<site(db)<language(db)
  async combineSiteBase({ atomClass, mergeConfigSite }) {
    return await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite });
  }
};
