// maybe modified by user
const __atomBasicFields = [
  'atomName', //
  'atomLanguage',
  'atomCategoryId',
  'atomTags',
  'allowComment',
  // 'atomStatic',
  // 'atomStaticKey',
  // 'atomRevision',
];

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    async _writeAtom({ key, item, user, atomSimple, atomStage }) {
      // write atom
      const atom = {};
      for (const field of __atomBasicFields) {
        if (item[field] !== undefined) atom[field] = item[field];
      }
      if ((atomSimple === 0 && atomStage === 0) || (atomSimple === 1 && atomStage === 1)) {
        atom.updatedAt = new Date();
      }
      if (atom.atomName) {
        atom.atomName = atom.atomName.trim();
      }
      // update
      atom.id = key.atomId;
      await this.ctx.bean.atom._update({ atom, user });
    }

    _appendRevisionToHistory({ item }) {
      if (!item.atomRevision || item.atomStage !== 2) return;
      if (!item._meta) item._meta = {};
      if (!item._meta.flags) item._meta.flags = [];
      item._meta.flags.push(`Rev.${item.atomRevision}`);
    }
  }

  return AtomBase;
};
