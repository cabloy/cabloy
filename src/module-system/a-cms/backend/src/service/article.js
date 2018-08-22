module.exports = app => {

  class Article extends app.Service {

    async create({ atomClass, key, atom, user }) {
      // add article
      const res = await this.ctx.model.article.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
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
      });
    }

    async delete({ atomClass, key, user }) {
      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
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
          url: 'render/article',
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
