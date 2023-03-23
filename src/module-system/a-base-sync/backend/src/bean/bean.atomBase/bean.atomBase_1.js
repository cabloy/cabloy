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

    _appendRevisionToHistory({ item }) {
      if (!item) return;
      if (!item.atomRevision || item.atomStage !== 2) return;
      const meta = this._ensureItemMeta(item);
      meta.flags.push(`Rev.${item.atomRevision}`);
    }

    async _atomStateTranslate({ item }) {
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

    async _dictTranslate({ item, atomClassBase }) {
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

    async _atomDisabledTranslate({ atomClass, item }) {
      //
      if (!item.atomDisabled) return;
      //
      if (!atomClass) {
        atomClass = await this.ctx.bean.atomClass.get({ id: item.atomClassId });
      }
      //
      const actionBase = this.ctx.bean.base.action({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        name: 'disable',
      });
      const title = this.ctx.bean.util.getProperty(actionBase, 'params.atomDisabled.title') || 'Disabled';
      const meta = this._ensureItemMeta(item);
      meta.flags.push(this.ctx.text(title));
    }

    async _userIdsTranslate({ items, item, atomClassBase }) {
      // userIds
      if (!atomClassBase.userIds) return;
      let userIdsKey = atomClassBase.userIds;
      if (!Array.isArray(userIdsKey)) {
        userIdsKey = userIdsKey.split(',');
      }
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
      const users = await this.ctx.bean.user.model.select({
        where: {
          id: userIdsWant,
        },
      });
      // set
      for (item of items) {
        for (const userIdKey of userIdsKey) {
          const userId = item[userIdKey];
          if (!userId) continue;
          const user = users.find(item => item.id === userId);
          if (!user) continue;
          item[`_${userIdKey}Name`] = user.userName;
          item[`_${userIdKey}Avatar`] = user.avatar;
        }
      }
    }

    async _atomNameLocaleTranslate({ items, item, atomClassBase }) {
      if (!atomClassBase) return;
      if (!atomClassBase.resource) return;
      // items
      if (item) {
        items = [item];
      }
      // set
      for (item of items) {
        if (!item.atomNameLocale) {
          item.atomNameLocale = this.ctx.text(item.atomName);
        }
      }
    }
  }

  return AtomBase;
};
