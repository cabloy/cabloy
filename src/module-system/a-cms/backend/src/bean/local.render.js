module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Render {
    async getArticleUrl({ atomClass, key }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getArticleUrl({ key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.combineSiteBase({ mergeConfigSite });
    }

    async getArticle({ key, inner }) {
      if (!inner) {
        // check right
        const roleAnonymous = await ctx.bean.role.getSystemRole({ roleName: 'anonymous' });
        const right = await ctx.bean.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return null;
      }
      // article
      const article = await ctx.bean.atom.read({ key, user: { id: 0 } });
      if (!article) return null;
      // todo:
      // check atomLanguage
      if (!article.atomLanguage) {
        article.atomLanguage = ctx.locale;
        // return null;
        // ctx.throw(1001);
      }
      return article;
    }

    async _deleteArticlePush({ atomClass, key, article, inner }) {
      ctx.tail(async () => {
        // queue
        await ctx.app.meta.queue.pushAsync({
          locale: ctx.locale,
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass, key, article, inner,
          },
        });
      });
    }

    async _renderArticlePush({ atomClass, key, inner }) {
      ctx.tail(async () => {
        // queue
        await ctx.app.meta.queue.pushAsync({
          locale: ctx.locale,
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass, key, inner,
          },
        });
      });
    }

  }

  return Render;
};
