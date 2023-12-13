module.exports = ctx => {
  const moduleInfo = module.info;
  class Render {
    async getArticleUrl({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter }) {
      // atomClass
      const { key, atomClass, options } = await ctx.bean.atom._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getArticleUrl({ key, options });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.combineSiteBase({ mergeConfigSite });
    }

    async getArticle({ key, inner }) {
      // 1. try to get article: maybe not exits
      const article = await ctx.bean.atom.read({ key, user: { id: 0 } });
      if (!article) return null;
      // 2. check right
      if (!inner) {
        // check right
        const roleAnonymous = await ctx.bean.role.getSystemRole({ roleName: 'anonymous' });
        const right = await ctx.bean.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return null;
      }
      // maybe site.language is false
      // // check atomLanguage
      // if (!article.atomLanguage) {
      //   article.atomLanguage = ctx.locale;
      //   // return null;
      //   // ctx.throw(1001);
      // }
      return article;
    }

    async _deleteArticlePushAsync({ atomClass, key, article, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(async () => {
        // queue
        await ctx.meta.util.queuePushAsync({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass,
            key,
            article,
            inner,
          },
        });
      });
    }

    async _deleteArticlePush({ atomClass, key, article, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(() => {
        // queue
        ctx.meta.util.queuePush({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass,
            key,
            article,
            inner,
          },
        });
      });
    }

    async _renderArticlePushAsync({ atomClass, key, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(async () => {
        // queue
        await ctx.meta.util.queuePushAsync({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass,
            key,
            inner,
          },
        });
      });
    }

    async _renderArticlePush({ atomClass, key, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(() => {
        // queue
        ctx.meta.util.queuePush({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass,
            key,
            inner,
          },
        });
      });
    }
  }

  return Render;
};
