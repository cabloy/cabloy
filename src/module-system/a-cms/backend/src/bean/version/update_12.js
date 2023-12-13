module.exports = app => {
  const moduleInfo = module.info;
  class Version {
    async _update_12(options) {
      await this._update12Migration(options);
    }

    async _update12Migration(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update12MigrationInstance',
        });
      }
    }

    async _update12MigrationInstance() {
      // articles/post
      await this._update12Migration_articles();
    }

    async _update12Migration_articles() {
      // first, hold articles
      const articles = await this.ctx.model.query(
        `
        select a.id as atomId,a.atomClassId,a.atomStage,a.userIdCreated,b.content
           from aAtom a
           left join aCmsContent b on a.id=b.atomId
            where a.iid=? and a.deleted=0 and a.atomStage=1
              and ( 
                        b.content like '%cms-pluginblock:blockAudio%'
                    or  b.content like '%cms-pluginblock:blockIFrame%'
                    or  b.content like '%cabloy-dashboard:blockCourse%'
                  )   
        `,
        [this.ctx.instance.id]
      );
      // then, update all articles
      await this.ctx.model.query(`
      update aCmsContent set content = replace (content,'cms-pluginblock:blockAudio','a-markdownblock:audio') where content like '%cms-pluginblock:blockAudio%'
    `);
      await this.ctx.model.query(`
      update aCmsContent set content = replace (content,'cms-pluginblock:blockIFrame','a-markdownblock:iframe') where content like '%cms-pluginblock:blockIFrame%'
    `);
      await this.ctx.model.query(`
      update aCmsContent set content = replace (content,'cabloy-dashboard:blockCourse','cabloy-course:blockCourseCodes') where content like '%cabloy-dashboard:blockCourse%'
    `);
      // loop
      for (const article of articles) {
        await this._update12Migration_article({ article });
      }
    }

    async _update12Migration_article({ article }) {
      // user
      const user = { id: article.userIdCreated };
      // open
      const res = await this.ctx.bean.atom.openDraft({ key: { atomId: article.atomId }, user });
      const draftKey = res.draft.key;
      // content
      let content = article.content;
      content = content.replace(/cms-pluginblock:blockAudio/gi, 'a-markdownblock:audio');
      content = content.replace(/cms-pluginblock:blockIFrame/gi, 'a-markdownblock:iframe');
      content = content.replace(/cabloy-dashboard:blockCourse/gi, 'cabloy-course:blockCourseCodes');
      // write
      await this.ctx.bean.atom.write({
        key: draftKey,
        target: null,
        item: {
          content,
        },
        options: {
          ignoreRender: true,
        },
        user,
      });
      // submit
      await this.ctx.bean.atom.submit({
        key: draftKey,
        options: {
          ignoreRender: true,
          ignoreFlow: true,
        },
        user,
      });
    }
  }
  return Version;
};
