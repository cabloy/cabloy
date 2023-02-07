module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    async read({ atomClass, options, key, user }) {
      // get
      const item = await this.ctx.bean.atom._get({ atomClass, options, key, mode: 'full', user });
      if (!item) return item;
      // atomClass
      const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
      // dict translate
      await this._dictTranslate({ item, atomClassBase });
      // revision
      this._appendRevisionToHistory({ item });
      // flow
      if (item.flowNodeNameCurrent) {
        item.flowNodeNameCurrentLocale = this.ctx.text(item.flowNodeNameCurrent);
      }
      // atomLanguage
      if (item.atomLanguage) {
        item.atomLanguageLocale = this.ctx.text(item.atomLanguage);
      }
      // atomDisabled
      await this._atomDisabledTranslate({ atomClass, item });
      // atomState
      const atomState = item.atomState;
      if (atomState !== undefined && atomState !== null) {
        await this._atomStateTranslate({ item });
      }
      // userIds
      await this._userIdsTranslate({ item, atomClassBase });
      // ok
      return item;
    }
  }

  return AtomBase;
};
