const require3 = require('require3');
const ExcelJS = require3('exceljs');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase extends app.meta.BeanBase {
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

    async selectBefore(/* { atomClass, options, user }*/) {
      // donothing
    }

    async select({ atomClass, options, items, user }) {
      if (items.length === 0) return;
      // atomClass
      const atomClassBase = atomClass ? await this.ctx.bean.atomClass.atomClass(atomClass) : null;
      // dict translate
      if (atomClassBase) {
        for (const item of items) {
          await this._dictTranslate({ item, atomClassBase });
        }
      }
      // revision
      this._appendRevisionToHistory({ items });
      // flow
      if (options.stage === 'draft') {
        for (const item of items) {
          if (item.flowNodeNameCurrent) {
            item.flowNodeNameCurrentLocale = this.ctx.text(item.flowNodeNameCurrent);
          }
        }
      }
      // atomLanguage
      await this._atomLanguageLocaleTranslate({ items });
      // atomDisabled
      await this._atomDisabledTranslate({ items });
      // atomState
      await this._atomStateTranslate({ items });
      // userIds
      await this._userIdsTranslate({ items, atomClassBase });
      // atomNameLocale for resource
      await this._atomNameLocaleTranslate({ items, atomClassBase });
    }

    async delete({ atomClass, key, options, user }) {
      // atomClass
      const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);
      if (atomClassBase.tag) {
        const _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
        if (_atomOld.atomTags) {
          // stage
          const atomStage = _atomOld.atomStage;
          await this.ctx.bean.tag.deleteTagRefs({ atomId: key.atomId });
          if (atomStage === 1) {
            await this.ctx.bean.tag.setTagAtomCount({ tagsNew: null, tagsOld: _atomOld.atomTags });
          }
        }
      }
      // delete
      await this.ctx.bean.atom._delete({
        atomClass,
        atom: { id: key.atomId },
        user,
      });
    }

    async submit({ atomClass, key, options, user }) {
      return await this.ctx.bean.atom._submitBase({ atomClass, key, options, user });
    }

    async enable({ /* atomClass,*/ key /* , user*/ }) {
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId,
        atomDisabled: 0,
      });
    }

    async disable({ /* atomClass,*/ key /* , user*/ }) {
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId,
        atomDisabled: 1,
      });
    }

    async copy(/* { atomClass, target, srcKey, srcItem, destKey, destItem, user }*/) {
      // do nothing
    }

    async exportBulk({ /* atomClass, options,*/ fields, items /* , user*/ }) {
      // workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'CabloyJS';
      workbook.created = new Date();
      // worksheet
      const worksheet = workbook.addWorksheet('Sheet');
      // columns
      const columns = [];
      for (const field of fields) {
        columns.push({
          header: this.ctx.text(field.title),
          key: field.name,
        });
      }
      worksheet.columns = columns;
      // rows
      const rows = [];
      for (const item of items) {
        const row = {};
        for (const field of fields) {
          row[field.name] = item[field.name];
        }
        rows.push(row);
      }
      worksheet.addRows(rows);
      // write
      const buffer = await workbook.xlsx.writeBuffer();
      // meta
      const meta = {
        filename: `${this.ctx.bean.util.now()}.xlsx`,
        encoding: '7bit',
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fields: {
          mode: 2,
          flag: 'atom-bulk-export',
        },
      };
      // ok
      return { type: 'buffer', data: buffer, meta };
    }

    async importBulk(/* {  atomClass, options, file , user }*/) {
      // do nothing
    }

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      return await this.ctx.bean.atom._checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
    }

    async prepareStaticItem({ moduleName, atomClass, item, register }) {
      return await this.ctx.bean.atomStatic._adjustItem_base({ moduleName, atomClass, item, register });
    }
  }
  return AtomBase;
};
