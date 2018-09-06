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
      // update article
      await this.ctx.model.article.update({
        id: key.itemId,
        language: item.language,
        categoryId: item.categoryId,
        sticky: item.sticky,
        keywords: item.keywords,
        description: item.description,
        editMode: item.editMode,
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=? where a.iid=? and a.atomId=?',
        [ item.content, this.ctx.instance.id, key.atomId ]);
    }

    async delete({ atomClass, key, user }) {
      // delete article
      await this.ctx.performAction({
        method: 'post',
        url: 'render/deleteArticle',
        body: { key },
      });
      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.query('delete from aCmsContent where iid=? and atomId=?',
        [ this.ctx.instance.id, key.atomId ]);
    }

    async action({ action, atomClass, key, user }) {
      if (action === 101) {
        // change flag
        await this.ctx.meta.atom.flag({
          key,
          atom: { atomFlag: 2 },
          user,
        });
        // render
        await this.ctx.performAction({
          method: 'post',
          url: 'render/renderArticle',
          body: { key },
        });
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
    }

  }

  return Article;
};
