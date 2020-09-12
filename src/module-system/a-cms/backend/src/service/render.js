module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Render extends app.Service {

    async getArticleUrl({ atomClass, key }) {
      if (!atomClass) {
        atomClass = await this.ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getArticleUrl({ key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.combineSiteBase();
    }

  }

  return Render;
};
