module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    async selectBefore(/* { atomClass, options, user }*/) {
      // donothing
    }

    async select({ atomClass, options, items, user }) {
      if (items.length === 0) return;
      // atomClass
      const atomClassBase = atomClass ? await this.ctx.bean.atomClass.atomClass(atomClass) : null;
      // dict translate
      await this._dictTranslate({ items, atomClassBase });
      // revision
      this._appendRevisionToHistory({ items });
      // flow
      this._flowNodeNameCurrentLocaleTranslate({ items });
      // atomLanguage
      this._atomLanguageLocaleTranslate({ items });
      // atomDisabled
      this._atomDisabledTranslate({ items });
      // atomState
      await this._atomStateTranslate({ items });
      // userIds
      await this._userIdsTranslate({ items, atomClassBase });
      // atomNameLocale for resource
      this._atomNameLocaleTranslate({ items, atomClassBase });
    }
  }

  return AtomBase;
};
