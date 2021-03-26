module.exports = ctx => {

  class Render {
    async getArticleUrl({ atomClass, key }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = ctx.build.cms.build({ atomClass });
      return await build.getArticleUrl({ key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.combineSiteBase({ mergeConfigSite });
    }
  }

  return Render;
};
