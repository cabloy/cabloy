module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    async delete({ atomClass, key, options, user }) {
      // atomClass
      const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
      if (atomClassBase.tag) {
        const _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
        if (_atomOld.atomTags) {
          // stage
          const atomStage = _atomOld.atomStage;
          await this.ctx.bean.tag.deleteTagRefs({ atomId: key.atomId });
          if (atomStage === 1) {
            await this.ctx.bean.tag.setTagAtomCount({ tagsNew: null, tagsOld: _atomOld.atomTags });
          }
        }
      }
      // delete
      await this.ctx.bean.atom._delete({
        atomClass,
        atom: { id: key.atomId },
        user,
      });
    }
  }

  return AtomBase;
};
