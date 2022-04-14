module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomStatic extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atomStatic');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async loadAllAtomStatics() {
      for (const module of this.ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const statics = module.main.meta && module.main.meta.base && module.main.meta.base.statics;
        if (!statics) continue;
        for (const atomClassKey in statics) {
          const [atomClassModule, atomClassName] = atomClassKey.split('.');
          const atomClass = { module: atomClassModule, atomClassName };
          const items = statics[atomClassKey].items;
          if (!items) continue;
          for (const item of items) {
            await this._loadAtomStatic({ moduleName, atomClass, item });
          }
        }
      }
    }

    async _loadAtomStatic({ moduleName, atomClass, item }) {
      // key not empty
      if (!item.atomStaticKey) throw new Error('atomStaticKey cannot be empty');
      const atomStaticKey = `${moduleName}:${item.atomStaticKey}`;
      const atomRevision = item.atomRevision || 0;
      // atomClassBase
      const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
      // get by key
      const atom = await this.ctx.bean.atom.readByStaticKey({
        atomClass,
        atomStaticKey,
        atomStage: 'formal',
      });
      if (atom) {
        if (atomRevision === -1) {
          // delete
          await this.ctx.bean.atom.delete({ key: { atomId: atom.atomId } });
        } else {
          // check revision: not use !==
          const changed = this._ifChanged({
            atomClassBase,
            atomRevisionWill: atomRevision,
            atomRevisionCurrent: atom.atomRevision,
          });
          if (changed) {
            item = await this._adjustItem({ moduleName, atomClass, item, register: false });
            await this._updateRevision({
              atomClassBase,
              atomClass,
              atomIdFormal: atom.atomId,
              atomIdDraft: atom.atomIdDraft,
              item,
            });
            await this._addResourceRoles({ atomId: atom.atomId, roles: item.resourceRoles });
          }
        }
      } else {
        if (atomRevision !== -1) {
          // register
          item = await this._adjustItem({ moduleName, atomClass, item, register: true });
          const atomId = await this._register({ atomClass, item });
          await this._addResourceRoles({ atomId, roles: item.resourceRoles });
        }
      }
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
        await this.ctx.bean.resource.addResourceRole({
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
        return this.ctx.text.locale(item.atomLanguage, value);
      }
      return value;
    }

    async _adjustItem({ moduleName, atomClass, item, register }) {
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
        const category = await this.ctx.bean.category.parseCategoryName({
          atomClass,
          language: item.atomLanguage,
          categoryName: item.atomCategoryId,
          force: true,
        });
        item.atomCategoryId = category.id;
      }
      if (typeof item.atomTags === 'string') {
        const tagIds = await this.ctx.bean.tag.parseTags({
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
        const roleName = item.roleIdOwner || 'template.system';
        const role = await this.ctx.bean.role.parseRoleName({ roleName });
        item.roleIdOwner = role.id;
      }
      // resourceRoles
      if (item.resourceRoles) {
        item.resourceRoles = await this.ctx.bean.role.parseRoleNames({ roleNames: item.resourceRoles, force: true });
      }
      // ok
      return item;
    }

    async _updateRevision({ atomClassBase, atomClass, atomIdFormal, atomIdDraft, item }) {
      return await this.ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomStatic.register.${item.atomStaticKey}`,
        fn: async () => {
          return await this.ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.startup.loadAtomStatics`,
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
      const atom = await this.ctx.bean.atom.modelAtom.get({ id: atomKey.atomId });
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
        await this.ctx.bean.atom.write({
          key: atomKey,
          item,
          user: { id: 0 },
        });
        // submit
        await this.ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
        // update
        await this.ctx.bean.atom.modelAtom.update({
          id: atomKey.atomId,
          atomName: item.atomName,
          atomRevision: item.atomRevision + 1,
        });
      } else {
        // update
        await this.ctx.bean.atom.modelAtom.update({
          id: atomKey.atomId,
          atomName: item.atomName,
          atomRevision: item.atomRevision,
        });
        // write
        await this.ctx.bean.atom.write({
          key: atomKey,
          item,
          user: { id: 0 },
        });
        // submit
        await this.ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
      }
    }

    async _register({ atomClass, item }) {
      return await this.ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomStatic.register.${item.atomStaticKey}`,
        fn: async () => {
          return await this.ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.startup.loadAtomStatics`,
            context: { atomClass, item },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ atomClass, item }) {
      // get again
      const atom = await this.ctx.bean.atom.readByStaticKey({
        atomClass,
        atomStaticKey: item.atomStaticKey,
        atomStage: 'formal',
      });
      if (atom) return atom.atomId;
      // add atom
      const atomKey = await this.ctx.bean.atom.create({
        atomClass,
        roleIdOwner: item.roleIdOwner,
        item,
        user: { id: 0 },
      });
      // write
      await this.ctx.bean.atom.write({
        key: atomKey,
        item,
        user: { id: 0 },
      });
      // submit
      const res = await this.ctx.bean.atom.submit({
        key: atomKey,
        options: { ignoreFlow: true },
        user: { id: 0 },
      });
      return res.formal.key.atomId;
    }
  }

  return AtomStatic;
};
