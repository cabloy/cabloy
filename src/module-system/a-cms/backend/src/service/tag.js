const utils = require('../common/utils.js');

module.exports = app => {

  class Tag extends app.Service {

    async list({ atomClass, options }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      if (!options.where) options.where = {};
      options.where.atomClassId = _atomClass.id;
      return await this.ctx.model.tag.select(options);
    }

    async add({ atomClass, data }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      // add
      const res = await this.ctx.model.tag.insert({
        atomClassId: _atomClass.id,
        language: data.language,
        tagName: data.tagName,
        articleCount: 0,
      });
      return res.insertId;
    }

    async save({ tagId, data }) {
      await this.ctx.model.tag.update({
        id: tagId,
        tagName: data.tagName,
      });
    }

    async delete({ tagId }) {
      // check articles
      const tag = await this.ctx.model.tag.get({ id: tagId });
      if (tag.articleCount > 0) this.ctx.throw(1005);

      // delete
      await this.ctx.model.tag.delete({ id: tagId });
    }

    async updateArticleTags({ atomClass, key, item }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      // tags
      let tags = null;
      if (item.tags) {
        tags = JSON.parse(item.tags);
        for (const tag of tags) {
          if (tag.id === 0) {
            tag.id = await this.create({ atomClassId: _atomClass.id, language: item.language, tagName: tag.name });
          }
        }
      }
      // force delete
      await this.deleteArticleTags({ key });
      // new
      if (tags && tags.length > 0) {
        await this.ctx.model.articleTag.insert({
          atomId: key.atomId,
          itemId: key.itemId,
          tags: JSON.stringify(tags),
        });
        for (const tag of tags) {
          await this.ctx.model.articleTagRef.insert({
            atomId: key.atomId,
            itemId: key.itemId,
            tagId: tag.id,
          });
        }
      }
      // ok
      return tags;
    }

    async deleteArticleTags({ key }) {
      await this.ctx.model.articleTag.delete({
        itemId: key.itemId,
      });
      await this.ctx.model.articleTagRef.delete({
        itemId: key.itemId,
      });
    }

    async setTagArticleCount({ tagsNew, tagsOld }) {
      // tags
      const tags = {};
      if (tagsNew) {
        const _tags = typeof tagsNew === 'string' ? JSON.parse(tagsNew) : tagsNew;
        for (const tag of _tags) {
          tags[tag.id] = tag;
        }
      }
      if (tagsOld) {
        const _tags = typeof tagsOld === 'string' ? JSON.parse(tagsOld) : tagsOld;
        for (const tag of _tags) {
          tags[tag.id] = tag;
        }
      }
      // loop
      for (const id in tags) {
        const articleCount = await this.calcArticleCount({ id });
        if (articleCount > 0) {
          // update
          await this.ctx.model.tag.update({ id, articleCount });
        } else {
          // check if referenced by items of deleted or other flag status
          const articleCount2 = await this.calcArticleCount2({ id });
          if (articleCount2 > 0) {
            // update
            await this.ctx.model.tag.update({ id, articleCount });
          } else {
            // delete
            await this.ctx.model.tag.delete({ id });
          }
        }
      }
    }

    async calcArticleCount({ id }) {
      const res = await this.ctx.model.query(`
        select count(*) articleCount from aCmsArticleTagRef a
          inner join aAtom b on a.atomId=b.id
          where a.iid=? and a.tagId=? and b.iid=? and b.deleted=0 and b.atomFlag=2
        `,
      [ this.ctx.instance.id, id, this.ctx.instance.id ]);
      return res[0].articleCount;
    }

    async calcArticleCount2({ id }) {
      const res = await this.ctx.model.query(`
        select count(*) articleCount from aCmsArticleTagRef a where a.iid=? and a.tagId=?
        `,
      [ this.ctx.instance.id, id ]);
      return res[0].articleCount;
    }

  }

  return Tag;
};
