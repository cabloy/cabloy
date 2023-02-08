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
const __itemBasicFields = ['id', 'iid', 'atomId', 'itemId', 'atomStage'];

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    async write({ atomClass, target, key, item, options, user }) {
      if (!item) return;
      // force delete atomDisabled
      delete item.atomDisabled;
      // simple/stage
      const atomSimple = item.atomSimple;
      const atomStage = item.atomStage;
      // atomClass
      const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
      let _atomOld;
      if (atomClassBase.tag && item.atomTags !== undefined && atomStage === 1) {
        _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      }
      // validate
      await this._writeValidate({ atomClass, target, key, item, options, user });
      // --- item is filtered by validation
      // write atom
      await this._writeAtom({ key, item, user, atomSimple, atomStage });
      // tag
      if (atomClassBase.tag && item.atomTags !== undefined) {
        await this.ctx.bean.tag.updateTagRefs({ atomId: key.atomId, atomTags: item.atomTags });
        if (atomStage === 1) {
          await this.ctx.bean.tag.setTagAtomCount({ tagsNew: item.atomTags, tagsOld: _atomOld.atomTags });
        }
      }
      // handle resource
      await this._writeHandleResource({ atomClass, atomClassBase, key, item });
    }

    async _writeValidate({ atomClass, target, key, item, options, user }) {
      // options
      const ignoreValidate = options && options.ignoreValidate;
      if (!ignoreValidate) {
        // itemHold
        const itemHold = {};
        for (const field of __itemBasicFields) {
          if (item[field] !== undefined) {
            itemHold[field] = item[field];
          }
        }
        // filterOptions
        const filterOptions = this._writeValidate_prepareFilterOptions({ target });
        // validate
        this.ctx.bean.util.setProperty(this.ctx, 'meta.validateHost', {
          atomClass,
          key,
          options,
          user,
        });
        await this.ctx.bean.validation._validate({ atomClass, data: item, options, filterOptions });
        this.ctx.bean.util.setProperty(this.ctx, 'meta.validateHost', null);
        // itemHold
        for (const field of __itemBasicFields) {
          if (item[field] === undefined && itemHold[field] !== undefined) {
            item[field] = itemHold[field];
          }
        }
      }
      // append itemId
      //   why always set value here: resource, data.id!==key.itemId
      item.id = key.itemId;
    }

    _writeValidate_prepareFilterOptions({ target }) {
      const filterOptions = {};
      if (!target) {
        // just save
        filterOptions.type = true;
        filterOptions.ebReadOnly = true;
      } else if (target === 'clone') {
        // clone
        filterOptions.type = true;
        filterOptions.ebReadOnly = true;
        filterOptions.ignoreRules = true;
      } else {
        // other target
        filterOptions.type = true;
        // filterOptions.ebReadOnly = true; // not set ebReadOnly
        filterOptions.ignoreRules = true;
      }
      return filterOptions;
    }

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

    async _writeHandleResource({ atomClass, atomClassBase, key, item }) {
      // atomId/stage
      const atomId = key.atomId;
      const atomStage = item.atomStage;
      const isAtomClassRole = atomClass.module === 'a-base' && atomClass.atomClassName === 'role';
      if (!isAtomClassRole && atomClassBase.resource && atomStage === 1) {
        // update locales
        if (item.atomName) {
          await this.ctx.bean.resource.setLocales({
            atomId,
            atomName: item.atomName,
          });
        }
        // role
        //   check if any role exists
        const right = await this.modelResourceRole.get({
          atomId,
        });
        if (!right) {
          // always add role of template.system when no records
          const roleSystem = await this.ctx.bean.role.parseRoleName({ roleName: 'template.system' });
          await this.ctx.bean.resource.addResourceRole({
            atomId,
            roleId: roleSystem.id,
          });
        }
      }
    }
  }

  return AtomBase;
};
