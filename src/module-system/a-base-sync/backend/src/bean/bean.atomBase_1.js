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

    _ensureItemMeta(item) {
      if (!item) return null;
      if (!item._meta) item._meta = {};
      if (!item._meta.flags) item._meta.flags = [];
      return item._meta;
    }

    _appendRevisionToHistory({ item }) {
      if (!item) return;
      if (!item.atomRevision || item.atomStage !== 2) return;
      const meta = this._ensureItemMeta(item);
      meta.flags.push(`Rev.${item.atomRevision}`);
    }

    async _dictTranslate({ item, _atomClass }) {
      const fields = _atomClass.dict && _atomClass.dict.fields;
      for (const fieldName in fields) {
        const field = fields[fieldName];
        if (field.translate === false) continue;
        //
        const code = item[fieldName];
        if (code === undefined) continue;
        const dictItem = await this.ctx.bean.dict.findItem({
          dictKey: field.dictKey,
          code,
          options: {
            separator: field.separator,
          },
        });
        if (dictItem) {
          item[`_${fieldName}Title`] = dictItem.titleFull;
          item[`_${fieldName}TitleLocale`] = dictItem.titleLocaleFull;
          if (dictItem.options && dictItem.options.icon) {
            item[`_${fieldName}Options`] = {
              icon: dictItem.options.icon,
            };
          }
        }
      }
    }
  }

  return AtomBase;
};
