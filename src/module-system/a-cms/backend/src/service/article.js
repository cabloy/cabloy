const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Article extends app.Service {

    async create({ atomClass, key, atom, user }) {
      const site = await this.ctx.service.render.combineSiteBase();
      const editMode = site.edit.mode;
      // add article
      const res = await this.ctx.model.article.insert({
        atomId: key.atomId,
        editMode,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.content.insert({
        atomId: key.atomId,
        itemId,
        content: '',
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, key, item, user }) {
      // read
    }

    async select({ atomClass, options, items, user }) {
      // select
    }

    async write({ atomClass, key, item, validation, user }) {
      // get atom for safety
      const atomOld = await this.ctx.meta.atom.read({ key, user });

      // url
      let url;
      if (item.slug) {
        url = `articles/${item.slug}.html`;
      } else {
        url = atomOld.url || `articles/${uuid.v4().replace(/-/g, '')}.html`;
      }
      // image first
      let imageFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/!\[[^\]]*?\]\(([^\)]*?)\)/);
        imageFirst = (matches && matches[1]) || '';
      }
      // audio first
      let audioFirst = '';
      let audioCoverFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/:::\s*audio([\s\S]*?):::/);
        let options = matches && matches[1];
        if (options) {
          options = JSON.parse(options);
          if (options && options.audio) {
            if (Array.isArray(options.audio)) {
              audioFirst = options.audio[0].url;
              audioCoverFirst = options.audio[0].cover;
            } else {
              audioFirst = options.audio.url;
              audioCoverFirst = options.audio.cover;
            }
          }
        }
      }
      // markdown
      const md = markdown.create();
      let html;
      // html
      if (item.editMode === 1) {
        html = item.content ? md.render(item.content) : '';
      } else {
        html = item.content;
      }
      // summary
      const summary = trimHtml(html, this.ctx.config.article.trim);
      // update article
      await this.ctx.model.article.update({
        id: key.itemId,
        language: item.language,
        categoryId: item.categoryId,
        sticky: item.sticky,
        keywords: item.keywords,
        description: item.description,
        summary: summary.html,
        url,
        editMode: item.editMode,
        slug: item.slug,
        sorting: item.sorting,
        flag: item.flag,
        extra: item.extra || '{}',
        imageFirst,
        audioFirst,
        audioCoverFirst,
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?',
        [ item.content, html, this.ctx.instance.id, key.atomId ]);

      // tags
      const tagsNew = await this.ctx.service.tag.updateArticleTags({ key, item });

      // set tag count , force check if delete tags
      // if (atomOld.atomFlag === 2) {
      await this.ctx.service.tag.setTagArticleCount({ tagsNew, tagsOld: atomOld.tags });
      // }

      // render
      await this._renderArticle({ key, inner: atomOld.atomFlag !== 2 });
    }

    async delete({ atomClass, key, user }) {
      // get atom for safety
      const atomOld = await this.ctx.meta.atom.read({ key, user });

      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.content.delete({
        itemId: key.itemId,
      });

      // delete tags
      await this.ctx.service.tag.deleteArticleTags({ key });

      // set tag count , force check if delete tags
      // if (atomOld.atomFlag === 2) {
      await this.ctx.service.tag.setTagArticleCount({ tagsNew: null, tagsOld: atomOld.tags });
      // }

      // delete article
      await this._deleteArticle({ key, article: atomOld, inner: atomOld.atomFlag !== 2 });
    }

    async action({ action, atomClass, key, user }) {
      if (action === 101) {
        // get atom for safety
        const atomOld = await this.ctx.meta.atom.read({ key, user });

        // change flag
        await this.ctx.meta.atom.flag({
          key,
          atom: { atomFlag: 2 },
          user,
        });
        // change flow
        await this.ctx.meta.atom.flow({
          key,
          atom: { atomFlow: 0 },
          user,
        });

        // tags
        if (atomOld.atomFlag !== 2) {
          await this.ctx.service.tag.setTagArticleCount({ tagsOld: atomOld.tags });
        }

        // render
        await this._renderArticle({ key, inner: false });
      }
    }

    async enable({ atomClass, key, atom, user }) {
      // enable
      const atomFlag = atom.atomEnabled ? 1 : 0;
      // change flag
      await this.ctx.meta.atom.flag({
        key,
        atom: { atomFlag },
        user,
      });
      if (this.ctx.config.article.publishOnSubmit) {
        // publish
        await this.action({ action: 101, key, user });
      }
    }

    async _deleteArticle({ key, article, inner }) {
      await this.ctx.dbMeta.push(async () => {
        // queue not async
        await this.ctx.app.meta.queue.push({
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'queueDeleteArticle',
          data: { key, article, inner },
        });
      });
    }

    async _renderArticle({ key, inner }) {
      await this.ctx.dbMeta.push(async () => {
        // queue not async
        await this.ctx.app.meta.queue.push({
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'queueRenderArticle',
          data: { key, inner },
        });
      });
    }

  }

  return Article;
};
