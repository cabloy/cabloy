const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomStatic extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atomStatic');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async loadAllAtomStatics() {
      for (const module of ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const statics = module.main.meta && module.main.meta.base && module.main.meta.base.statics;
        if (!statics) continue;
        for (const atomClassKey in statics) {
          const [atomClassModule, atomClassName] = atomClassKey.split('.');
          const atomClass = { module: atomClassModule, atomClassName };
          const items = statics[atomClassKey].items;
          if (!items) continue;
          await this.loadAtomStatics({ moduleName, atomClass, items });
        }
      }
    }

    async loadAtomStatics({ moduleName, atomClass, items }) {
      for (const item of items) {
        await this.loadAtomStatic({ moduleName, atomClass, item });
      }
    }

    async preloadAtomStatic({ atomStaticKey }) {
      const data = this._findAtomStatic({ atomStaticKey });
      if (!data) return null;
      const atomKey = await this.loadAtomStatic(data);
      return atomKey;
    }

    async loadAtomStatic({ moduleName, atomClass, item }) {
      moduleName = moduleName || this.moduleName;
      // key not empty
      if (!item.atomStaticKey) {
        throw new Error(`atomStaticKey cannot be empty for atom: ${moduleName}:${item.atomName}`);
      }
      const atomStaticKey = `${moduleName}:${item.atomStaticKey}`;
      const atomRevision = item.atomRevision || 0;
      // atomClassBase
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // get by key
      const atom = await ctx.bean.atom.readByStaticKey({
        atomClass,
        atomStaticKey,
        atomStage: 'formal',
      });
      // exists
      if (atom) {
        if (atomRevision === -1) {
          // delete
          await ctx.bean.atom.delete({ key: { atomId: atom.atomId } });
          return null;
        }
        // check revision: not use !==
        const changed = this._ifChanged({
          atomClassBase,
          atomRevisionWill: atomRevision,
          atomRevisionCurrent: atom.atomRevision,
        });
        if (changed) {
          item = await this._adjustItem({ moduleName, atomClass, atomClassBase, item, register: false });
          await this._updateRevision({
            atomClassBase,
            atomClass,
            atomIdFormal: atom.atomId,
            atomIdDraft: atom.atomIdDraft,
            item,
          });
          await this._addResourceRoles({ atomId: atom.atomId, roles: item.resourceRoles });
        }
        return { atomId: atom.atomId, itemId: atom.itemId };
      }
      // not exists
      if (atomRevision === -1) {
        // do nothing
        return null;
      }
      // register
      item = await this._adjustItem({ moduleName, atomClass, atomClassBase, item, register: true });
      const atomKey = await this._register({ atomClass, item });
      await this._addResourceRoles({ atomId: atomKey.atomId, roles: item.resourceRoles });
      return atomKey;
    }

    _ifChanged({ atomClassBase, atomRevisionWill, atomRevisionCurrent }) {
      let changed;
      if (atomClassBase.simple) {
        changed = atomRevisionWill >= atomRevisionCurrent;
      } else {
        changed = atomRevisionWill > atomRevisionCurrent;
      }
      return changed;
    }

    async _addResourceRoles({ atomId, roles }) {
      if (!roles || !roles.length) return;
      for (const role of roles) {
        if (!role) continue;
        await ctx.bean.resource.addResourceRole({
          atomId,
          roleId: role.id,
        });
      }
    }

    // ctx.text is not good for resource
    //   so, support only for atomLanguage
    _getAtomFieldValueByLocale(item, field) {
      const value = item[field];
      if (value && item.atomLanguage) {
        return ctx.text.locale(item.atomLanguage, value);
      }
      return value;
    }

    _adjustItem_atomCategoryId({ atomClass, item }) {
      if (
        atomClass.module === 'a-base' &&
        atomClass.atomClassName === 'resource' &&
        ['a-base:menu', 'a-base:mine'].includes(item.resourceType)
      ) {
        const parts = item.atomCategoryId.split('.');
        if (parts[0] !== item.resourceType) {
          parts.unshift(item.resourceType);
        }
        parts.splice(1, 0, item.appKey || 'a-appbooster:appUnclassified');
        item.atomCategoryId = parts.join('.');
      }
    }

    async _adjustItem({ moduleName, atomClass, atomClassBase, item, register }) {
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      item = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { moduleName, atomClass, item, register },
        fn: 'prepareStaticItem',
      });
      return item;
    }
    async _adjustItem_base({ moduleName, atomClass, item, register }) {
      // item
      item = {
        ...item,
        atomStatic: 1,
        atomStaticKey: `${moduleName}:${item.atomStaticKey}`,
        atomRevision: item.atomRevision || 0,
        atomName: this._getAtomFieldValueByLocale(item, 'atomName'),
      };
      if (item.description !== undefined) {
        item.description = this._getAtomFieldValueByLocale(item, 'description');
      }
      // atomLanguage,atomCategoryId,atomTags
      if (typeof item.atomCategoryId === 'string') {
        this._adjustItem_atomCategoryId({ atomClass, item });
        const category = await ctx.bean.category.parseCategoryName({
          atomClass,
          language: item.atomLanguage,
          categoryName: item.atomCategoryId,
          force: true,
        });
        item.atomCategoryId = category.id;
      }
      if (typeof item.atomTags === 'string') {
        const tagIds = await ctx.bean.tag.parseTags({
          atomClass,
          language: item.atomLanguage,
          tagName: item.atomTags,
          force: true,
        });
        item.atomTags = JSON.stringify(tagIds);
      }
      // only valid for register
      if (register) {
        // roleIdOwner
        const roleName = item.roleIdOwner || 'authenticated.builtIn';
        const role = await ctx.bean.role.parseRoleName({ roleName });
        item.roleIdOwner = role.id;
      }
      // resourceRoles
      if (item.resourceRoles) {
        item.resourceRoles = await ctx.bean.role.parseRoleNames({ roleNames: item.resourceRoles, force: true });
      }
      // ok
      return item;
    }

    _findAtomStatic({ atomStaticKey }) {
      const [_moduleName, _atomStaticKey] = atomStaticKey.split(':');
      for (const module of ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        if (moduleName !== _moduleName) continue;
        const statics = module.main.meta && module.main.meta.base && module.main.meta.base.statics;
        if (!statics) continue;
        for (const atomClassKey in statics) {
          const [atomClassModule, atomClassName] = atomClassKey.split('.');
          const atomClass = { module: atomClassModule, atomClassName };
          const items = statics[atomClassKey].items;
          if (!items) continue;
          for (const item of items) {
            if (item.atomStaticKey === _atomStaticKey) {
              return { moduleName, atomClass, item };
            }
          }
        }
      }
      return null;
    }

    async _updateRevision({ atomClassBase, atomClass, atomIdFormal, atomIdDraft, item }) {
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomStatic.register.${item.atomStaticKey}`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomStatic',
            context: { atomClassBase, atomClass, atomIdFormal, atomIdDraft, item },
            fn: '_updateRevisionLock',
          });
        },
      });
    }

    async _updateRevisionLock({ atomClassBase, atomIdFormal, atomIdDraft, item }) {
      // get atom/atomKey
      const atomKey = {
        atomId: atomClassBase.simple ? atomIdFormal : atomIdDraft,
      };
      const atom = await ctx.bean.atom.modelAtom.get({ id: atomKey.atomId });
      atomKey.itemId = atom.itemId;
      // check changed again
      const changed = this._ifChanged({
        atomClassBase,
        atomRevisionWill: item.atomRevision,
        atomRevisionCurrent: atom.atomRevision,
      });
      if (!changed) return;
      // simple/normal
      if (atomClassBase.simple) {
        // write
        await ctx.bean.atom.write({
          key: atomKey,
          item,
          user: { id: 0 },
        });
        // submit
        await ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
        // update
        await ctx.bean.atom.modelAtom.update({
          id: atomKey.atomId,
          atomName: item.atomName,
          atomRevision: item.atomRevision + 1,
        });
      } else {
        // update
        await ctx.bean.atom.modelAtom.update({
          id: atomKey.atomId,
          atomName: item.atomName,
          atomRevision: item.atomRevision,
        });
        // write
        await ctx.bean.atom.write({
          key: atomKey,
          item,
          user: { id: 0 },
        });
        // submit
        await ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
      }
    }

    async _register({ atomClass, item }) {
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomStatic.register.${item.atomStaticKey}`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomStatic',
            context: { atomClass, item },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ atomClass, item }) {
      // get again
      const atom = await ctx.bean.atom.readByStaticKey({
        atomClass,
        atomStaticKey: item.atomStaticKey,
        atomStage: 'formal',
      });
      if (atom) {
        return { atomId: atom.atomId, itemId: atom.itemId };
      }
      // add atom
      const atomKey = await ctx.bean.atom.create({
        atomClass,
        roleIdOwner: item.roleIdOwner,
        item,
        user: { id: 0 },
      });
      // write
      await ctx.bean.atom.write({
        key: atomKey,
        item,
        user: { id: 0 },
      });
      // submit
      const res = await ctx.bean.atom.submit({
        key: atomKey,
        options: { ignoreFlow: true },
        user: { id: 0 },
      });
      return res.formal.key;
    }
  }

  return AtomStatic;
};
