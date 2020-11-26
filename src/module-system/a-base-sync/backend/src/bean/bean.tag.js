module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Tag {

    get modelTag() {
      return ctx.model.module(moduleInfo.relativeName).tag;
    }

    get modelTagRef() {
      return ctx.model.module(moduleInfo.relativeName).tagRef;
    }

    async count({ atomClass, tagLanguage }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      return await this.modelTag.count({
        atomClassId: atomClass.id,
        tagLanguage,
      });
    }

    async list({ atomClass, options }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      if (!options.where) options.where = {};
      options.where.atomClassId = atomClass.id;
      return await this.modelTag.select(options);
    }

    async add({ atomClass, data }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // add
      const res = await this.modelTag.insert({
        atomClassId: atomClass.id,
        tagLanguage: data.tagLanguage,
        tagName: data.tagName,
        tagAtomCount: 0,
      });
      return res.insertId;
    }

    async save({ tagId, data }) {
      await this.modelTag.update({
        id: tagId,
        tagName: data.tagName,
      });
    }

    async delete({ tagId }) {
      // check atoms
      const count = await this.modelTagRef.count({ tagId });
      if (count > 0) ctx.throw.module(moduleInfo.relativeName, 1012);

      // delete
      await this.modelTag.delete({ id: tagId });
    }

    async updateTagRefs({ atomId, atomTags }) {
      // tags
      if (typeof atomTags === 'string') {
        atomTags = JSON.parse(atomTags);
      }
      // force delete
      await this.deleteTagRefs({ atomId });
      // new
      if (atomTags && atomTags.length > 0) {
        for (const tagId of atomTags) {
          await this.modelTagRef.insert({
            atomId,
            tagId,
          });
        }
      }
      // ok
      return atomTags;
    }

    async deleteTagRefs({ atomId }) {
      await this.modelTagRef.delete({
        atomId,
      });
    }

    async setTagAtomCount({ tagsNew, tagsOld }) {
      // tags
      const tags = {};
      if (tagsNew) {
        const _tags = typeof tagsNew === 'string' ? JSON.parse(tagsNew) : tagsNew;
        for (const tagId of _tags) {
          tags[tagId] = true;
        }
      }
      if (tagsOld) {
        const _tags = typeof tagsOld === 'string' ? JSON.parse(tagsOld) : tagsOld;
        for (const tagId of _tags) {
          tags[tagId] = true;
        }
      }
      // loop
      for (const tagId in tags) {
        const tagAtomCount = await this.calcAtomCount({ tagId });
        // update
        await this.modelTag.update({ id: tagId, tagAtomCount });
      }
    }

    async calcAtomCount({ tagId }) {
      const res = await ctx.model.query(`
        select count(*) atomCount from aTagRef a
          inner join aAtom b on a.atomId=b.id
          where a.iid=? and a.tagId=? and b.iid=? and b.deleted=0 and b.atomStage=1
        `,
      [ ctx.instance.id, tagId, ctx.instance.id ]);
      return res[0].atomCount;
    }

  }
  return Tag;
};
