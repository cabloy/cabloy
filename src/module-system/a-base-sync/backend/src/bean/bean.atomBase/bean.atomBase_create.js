module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase {
    async create({ atomClass, item, options, user }) {
      // atomClass
      const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
      // atomName
      if (!item.atomName) {
        // draftId
        const sequence = this.ctx.bean.sequence.module(moduleInfo.relativeName);
        const draftId = await sequence.next('draft');
        if (atomClass.module === 'a-base' && atomClass.atomClassName === 'user') {
          item.atomName = `${this.ctx.text('User')}__${draftId}`;
        } else {
          item.atomName = `${this.ctx.text('Draft')}-${draftId}`;
        }
      }
      // atomStaticKey
      if (!item.atomStaticKey) {
        item.atomStaticKey = this.ctx.bean.util.uuidv4();
      }
      // atomSimple
      if (atomClassBase.simple) {
        item.atomSimple = 1;
        item.atomStage = 1;
      } else {
        item.atomSimple = 0;
        item.atomStage = 0;
      }
      // roleIdOwner
      const bAtomClassRole = atomClass && atomClass.module === 'a-base' && atomClass.atomClassName === 'role';
      if (!item.roleIdOwner && !bAtomClassRole) {
        let roleId;
        if (options.preferredRole) {
          roleId = await this.ctx.bean.atom.preferredRoleId({ atomClass, user });
          if (!roleId) this.ctx.throw(403);
        } else {
          const roleName = 'authenticated.builtIn';
          const role = await this.ctx.bean.role.parseRoleName({ roleName });
          roleId = role.id;
        }
        item.roleIdOwner = roleId;
      }
      // atomCategoryId
      if (item.atomCategoryId && typeof item.atomCategoryId === 'string') {
        const category = await this.ctx.bean.category.parseCategoryName({
          atomClass,
          language: item.atomLanguage,
          categoryName: item.atomCategoryId,
          force: false, // not force, because this api maybe called by normal user
        });
        if (!category) {
          throw new Error(`Category not found: ${item.atomCategoryId}`);
        }
        item.atomCategoryId = category.id;
      }
      // add
      const atomId = await this.ctx.bean.atom._add({ atomClass, atom: item, user });
      return { atomId };
    }
  }

  return AtomBase;
};
