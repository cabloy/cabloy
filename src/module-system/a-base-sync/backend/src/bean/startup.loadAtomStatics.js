
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Startup extends app.meta.BeanBase {

    async execute() {
      await this._loadAtomStatics();
    }

    async _loadAtomStatics() {
      for (const module of this.ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const statics = module.main.meta && module.main.meta.base && module.main.meta.base.statics && module.main.meta.base.statics;
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
        // check revision
        if (atomRevision !== atom.atomRevision) {
          item = await this._adjustItem({ moduleName, atomClass, item });
          await this._updateRevision({ atomClass, atomIdArchive: atom.atomId, atomIdDraft: atom.atomIdDraft, item });
        }
      } else {
        // register
        item = await this._adjustItem({ moduleName, atomClass, item });
        await this._register({ atomClass, item });
      }
    }

    async _adjustItem({ moduleName, atomClass, item }) {
      // item
      item = {
        ...item,
        atomStatic: 1,
        atomStaticKey: `${moduleName}:${item.atomStaticKey}`,
        atomRevision: item.atomRevision || 0,
        atomName: this.ctx.text(item.atomName),
        description: this.ctx.text(item.description),
      };
      // atomLanguage,atomCategoryId,atomTags
      if (typeof item.atomCategoryId === 'string') {
        const category = await this.ctx.bean.category.parseCategoryName({
          atomClass,
          categoryLanguage: item.atomLanguage,
          categoryName: item.atomCategoryId,
          force: true,
        });
        item.atomCategoryId = category.id;
      }
      if (typeof item.atomTags === 'string') {
        const tagIds = await this.ctx.bean.tag.parseTags({
          atomClass,
          tagLanguage: item.atomLanguage,
          tagName: item.atomTags,
          force: true,
        });
        item.atomTags = JSON.stringify(tagIds);
      }
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
      if (atom) return;
      // add atom
      const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
      const atomKey = await this.ctx.bean.atom.create({
        atomClass,
        roleIdOwner: roleSuperuser.id,
        item,
        user: { id: 0 },
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

  }

  return Startup;
};
