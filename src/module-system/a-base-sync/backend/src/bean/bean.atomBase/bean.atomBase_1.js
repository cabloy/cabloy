module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    get modelResourceRole() {
      return this.ctx.model.module(moduleInfo.relativeName).resourceRole;
    }

    _ensureItemMeta(item) {
      if (!item) return null;
      if (!item._meta) item._meta = {};
      if (!item._meta.flags) item._meta.flags = [];
      return item._meta;
    }

    _appendRevisionToHistory({ items, item }) {
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        if (!item.atomRevision || item.atomStage !== 2) continue;
        const meta = this._ensureItemMeta(item);
        meta.flags.push(`Rev.${item.atomRevision}`);
      }
    }

    async _atomStateTranslate({ items, item }) {
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        await this._atomStateTranslate_item({ item });
      }
    }

    async _atomStateTranslate_item({ item }) {
      // atomState
      const atomState = item.atomState;
      if (atomState === undefined || atomState === null) return;
      // atomClass
      const atomClassBase = this.ctx.bean.base.atomClass({
        module: item.module,
        atomClassName: item.atomClassName,
      });
      // dictKey
      const atomStage = item.atomStage === 0 ? 'draft' : item.atomStage === 1 ? 'formal' : null;
      if (!atomStage) return;
      const dictKey = this.ctx.bean.util.getProperty(atomClassBase, `dict.states.${atomStage}.dictKey`);
      if (!dictKey) return;
      // dictItem
      const dictItem = await this.ctx.bean.dict.findItem({
        dictKey,
        code: atomState,
      });
      if (!dictItem) return;
      // res
      item._atomStateTitle = dictItem.titleFull;
      item._atomStateTitleLocale = dictItem.titleLocaleFull;
    }

    async _dictTranslate({ items, item, atomClassBase }) {
      if (!atomClassBase) return;
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        await this._dictTranslate_item({ item, atomClassBase });
      }
    }

    async _dictTranslate_item({ item, atomClassBase }) {
      const fields = atomClassBase.dict && atomClassBase.dict.fields;
      for (const fieldName in fields) {
        const field = fields[fieldName];
        const code = item[fieldName];
        const _item = await this._dictTranslateField({ fieldName, code, field });
        if (_item) {
          Object.assign(item, _item);
        }
      }
    }

    async _dictTranslateField({ fieldName, code, field }) {
      if (field.translate === false) return null;
      if (code === undefined) return null;
      //
      const dictItem = await this.ctx.bean.dict.findItem({
        dictKey: field.dictKey,
        code,
        options: {
          separator: field.separator,
        },
      });
      if (!dictItem) return null;
      // res
      const _item = {};
      _item[`_${fieldName}Title`] = dictItem.titleFull;
      _item[`_${fieldName}TitleLocale`] = dictItem.titleLocaleFull;
      if (dictItem.options && dictItem.options.icon) {
        _item[`_${fieldName}Options`] = {
          icon: dictItem.options.icon,
        };
      }
      return _item;
    }

    _atomDisabledTranslate({ items, item }) {
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        this._atomDisabledTranslate_item({ item });
      }
    }

    _atomDisabledTranslate_item({ item }) {
      //
      if (!item.atomDisabled) return;
      //
      const actionBase = this.ctx.bean.base.action({
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'disable',
      });
      const title = this.ctx.bean.util.getProperty(actionBase, 'params.atomDisabled.title') || 'Disabled';
      const meta = this._ensureItemMeta(item);
      meta.flags.push(this.ctx.text(title));
    }

    async _atomCategoryIdTranslate({ items, item }) {
      // items
      if (item) {
        items = [item];
      }
      // categoryIdsWant
      const categoryIdsWantMap = {};
      for (item of items) {
        const categoryId = item.atomCategoryId;
        if (categoryId) {
          categoryIdsWantMap[categoryId] = true;
        }
      }
      const categoryIdsWant = Object.keys(categoryIdsWantMap).map(categoryId => parseInt(categoryId));
      if (categoryIdsWant.length === 0) return;
      // select
      const categoriesWant = await this.ctx.bean.category.getCacheCategories({ categoryIds: categoryIdsWant });
      // set
      for (item of items) {
        const categoryId = item.atomCategoryId;
        if (!categoryId) continue;
        const category = categoriesWant.find(item => item.id === categoryId);
        if (!category) continue;
        item.atomCategoryName = category.categoryName;
      }
    }

    async _userIdsTranslate({ items, item, atomClassBase }) {
      // userIdsKey
      let userIdsKey = (atomClassBase && atomClassBase.userIds) || [];
      if (!Array.isArray(userIdsKey)) {
        userIdsKey = userIdsKey.split(',');
      }
      userIdsKey.push('userIdCreated');
      userIdsKey.push('userIdUpdated');
      // items
      if (item) {
        items = [item];
      }
      // userIdsWant
      const userIdsWantMap = {};
      for (item of items) {
        for (const userIdKey of userIdsKey) {
          const userId = item[userIdKey];
          if (userId) {
            userIdsWantMap[userId] = true;
          }
        }
      }
      const userIdsWant = Object.keys(userIdsWantMap).map(userId => parseInt(userId));
      if (userIdsWant.length === 0) return;
      // select
      const usersWant = await this.ctx.bean.user.getCacheUsers({ userIds: userIdsWant });
      // set
      for (item of items) {
        for (const userIdKey of userIdsKey) {
          const userId = item[userIdKey];
          if (!userId) continue;
          const user = usersWant.find(item => item.id === userId);
          if (!user) continue;
          if (userIdKey === 'userIdCreated') {
            item.userName = user.userName;
            item.avatar = user.avatar;
          } else if (userIdKey === 'userIdUpdated') {
            item.userNameUpdated = user.userName;
            item.avatarUpdated = user.avatar;
          } else {
            item[`_${userIdKey}Name`] = user.userName;
            item[`_${userIdKey}Avatar`] = user.avatar;
          }
        }
      }
    }

    _atomNameLocaleTranslate({ items, item, atomClassBase }) {
      if (atomClassBase && !atomClassBase.resource) return;
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        // atomClass
        let _atomClassBase = atomClassBase;
        if (!_atomClassBase) {
          _atomClassBase = this.ctx.bean.base.atomClass({
            module: item.module,
            atomClassName: item.atomClassName,
          });
        }
        if (!_atomClassBase.resource) continue;
        // set
        if (!item.atomNameLocale) {
          item.atomNameLocale = this.ctx.text(item.atomName);
        }
      }
    }

    _atomLanguageLocaleTranslate({ items, item }) {
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        if (item.atomLanguage) {
          item.atomLanguageLocale = this.ctx.text(item.atomLanguage);
        }
      }
    }

    async _patchAtomClassInfo({ items, item, atomClassBase }) {
      if (atomClassBase && atomClassBase.itemOnly) return;
      // items
      if (item) {
        items = [item];
      }
      if (items.length === 0) return;
      // atomClassIds
      const atomClassIds = Set.unique(items.map(item => item.atomClassId));
      // cache
      const atomClasses = await this.ctx.bean.summer.mget(
        { module: moduleInfo.relativeName, name: 'atomClassInfo' },
        atomClassIds
      );
      for (const item of items) {
        const atomClass = atomClasses.find(atomClass => atomClass.id === item.atomClassId);
        item.module = atomClass.module;
        item.atomClassName = atomClass.atomClassName;
      }
    }
  }

  return AtomBase;
};
