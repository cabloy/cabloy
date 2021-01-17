
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Startup extends app.meta.BeanBase {

    async execute() {
      await this._loadAtomStatics();
    }

    async _loadAtomStatics() {
      for (const module of this.ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const statics = module.main.meta && module.main.meta.base && module.main.meta.base.statics;
        if (!statics) continue;
        for (const atomClassKey in statics) {
          const [ atomClassModule, atomClassName ] = atomClassKey.split('.');
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
      // get by key
      const atom = await this.ctx.bean.atom.readByStaticKey({
        atomClass,
        atomStaticKey,
        atomStage: 'archive',
      });
      if (atom) {
        if (atomRevision === -1) {
          // delete
          await this.ctx.bean.atom.delete({ key: { atomId: atom.atomId } });
        } else {
          // check revision: not use !==
          if (atomRevision > atom.atomRevision) {
            item = await this._adjustItem({ moduleName, atomClass, item, register: false });
            await this._updateRevision({ atomClass, atomIdArchive: atom.atomId, atomIdDraft: atom.atomIdDraft, item });
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

    async _addResourceRoles({ atomId, roles }) {
      if (!roles || !roles.length) return;
      for (const role of roles) {
        if (!role) continue;
        await this.ctx.bean.resource.addResourceRole({
          atomId, roleId: role.id,
        });
      }
    }

    async _adjustItem({ moduleName, atomClass, item, register }) {
      // item
      item = {
        ...item,
        atomStatic: 1,
        atomStaticKey: `${moduleName}:${item.atomStaticKey}`,
        atomRevision: item.atomRevision || 0,
        // ctx.text is not good for resource
        // atomName: this.ctx.text(item.atomName),
        // description: this.ctx.text(item.description),
      };
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
        const roleName = item.roleIdOwner || 'superuser';
        const role = await this.ctx.bean.role.parseRoleName({ roleName });
        item.roleIdOwner = role.id;
        // resourceRoles
        if (item.resourceRoles) {
          item.resourceRoles = await this.ctx.bean.role.parseRoleNames({ roleNames: item.resourceRoles });
        }
      }
      // ok
      return item;
    }

    async _updateRevision({ atomClass, atomIdArchive, atomIdDraft, item }) {
      return await this.ctx.app.meta.util.lock({
        subdomain: this.ctx.subdomain,
        resource: `${moduleInfo.relativeName}.atomStatic.register.${item.atomStaticKey}`,
        fn: async () => {
          return await this.ctx.app.meta.util.executeBean({
            subdomain: this.ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.startup.loadAtomStatics`,
            context: { atomClass, atomIdArchive, atomIdDraft, item },
            fn: '_updateRevisionLock',
          });
        },
      });
    }

    async _updateRevisionLock({ atomIdDraft, item }) {
      // get draft
      const atom = await this.ctx.bean.atom.modelAtom.get({ id: atomIdDraft });
      if (item.atomRevision === atom.atomRevision) return;
      const atomKey = {
        atomId: atomIdDraft, itemId: atom.itemId,
      };
      // update
      await this.ctx.bean.atom.modelAtom.update({
        id: atomIdDraft,
        atomName: item.atomName,
        atomRevision: item.atomRevision,
      });
      // write
      await this.ctx.bean.atom.write({
        key: atomKey, item, user: { id: 0 },
      });
      // submit
      await this.ctx.bean.atom.submit({
        key: atomKey,
        options: { ignoreFlow: true },
        user: { id: 0 },
      });
    }

    async _register({ atomClass, item }) {
      return await this.ctx.app.meta.util.lock({
        subdomain: this.ctx.subdomain,
        resource: `${moduleInfo.relativeName}.atomStatic.register.${item.atomStaticKey}`,
        fn: async () => {
          return await this.ctx.app.meta.util.executeBean({
            subdomain: this.ctx.subdomain,
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
        atomStage: 'archive',
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
        key: atomKey, item, user: { id: 0 },
      });
      // submit
      const res = await this.ctx.bean.atom.submit({
        key: atomKey,
        options: { ignoreFlow: true },
        user: { id: 0 },
      });
      return res.archive.key.atomId;
    }

  }

  return Startup;
};
