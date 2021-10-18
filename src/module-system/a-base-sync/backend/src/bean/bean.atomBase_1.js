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

    async _dictTranslate({ item, _atomClass }) {
      const fields = _atomClass.dict && _atomClass.dict.fields;
      for (const fieldName in fields) {
        const field = fields[fieldName];
        if (!field.translate) continue;
        //
        const { titleFull, titleLocaleFull } = await this.ctx.bean.dict.find({
          dictKey: field.dictKey,
          code: item[fieldName],
          options: {
            translate: field.translate,
            separator: field.separator,
          },
        });
        item[`_${fieldName}Title`] = titleFull;
        item[`_${fieldName}TitleLocale`] = titleLocaleFull;
      }
    }
  }

  return AtomBase;
};
