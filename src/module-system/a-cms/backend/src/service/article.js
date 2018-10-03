const require3 = require('require3');
const trimHtml = require3('trim-html');
const markdown = require3('@zhennann/markdown');

module.exports = app => {

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

      // image first
      let imageFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/!\[[^\]]*?\]\(([^\)]*?)\)/);
        imageFirst = (matches && matches[1]) || '';
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
        editMode: item.editMode,
        slug: item.slug,
        sorting: item.sorting,
        flag: item.flag,
        extra: item.extra || '{}',
        imageFirst,
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?',
        [ item.content, html, this.ctx.instance.id, key.atomId ]);


      // tags
      const tagsNew = await this.ctx.service.tag.updateArticleTags({ key, item });
      if (atomOld.atomFlag === 2) {
        await this.ctx.service.tag.setTagArticleCount({ tagsNew, tagsOld: atomOld.tags });
      }

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
      await this.ctx.performAction({
        method: 'post',
        url: 'render/deleteArticle',
        body: { key, article: atomOld, inner: atomOld.atomFlag !== 2 },
      });
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

    async _renderArticle({ key, inner }) {
      await this.ctx.performAction({
        method: 'post',
        url: 'render/renderArticle',
        body: { key, inner },
      });
    }


  }

  return Article;
};
