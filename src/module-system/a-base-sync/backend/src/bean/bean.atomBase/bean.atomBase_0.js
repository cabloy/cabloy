const require3 = require('require3');
const uuid = require3('uuid');
const ExcelJS = require3('exceljs');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase extends app.meta.BeanBase {
    async create({ atomClass, item, options, user }) {
      // atomClass
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
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
        item.atomStaticKey = uuid.v4().replace(/-/g, '');
      }
      // atomSimple
      if (_atomClass.simple) {
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
      // add
      const atomId = await this.ctx.bean.atom._add({ atomClass, atom: item, user });
      return { atomId };
    }

    async read({ atomClass, options, key, user }) {
      // get
      const item = await this.ctx.bean.atom._get({ atomClass, options, key, mode: 'full', user });
      if (!item) return item;
      // atomClass
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
      // dict translate
      await this._dictTranslate({ item, _atomClass });
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
      // ok
      return item;
    }

    async selectBefore(/* { atomClass, options, user }*/) {
      // donothing
    }

    async select({ atomClass, options, items, user }) {
      if (items.length === 0) return;
      // atomClass
      const _atomClass = atomClass ? await this.ctx.bean.atomClass.atomClass(atomClass) : null;
      // dict translate
      if (_atomClass) {
        for (const item of items) {
          await this._dictTranslate({ item, _atomClass });
        }
      }
      // revision
      if (options.stage === 'history') {
        for (const item of items) {
          this._appendRevisionToHistory({ item });
        }
      }
      // flow
      if (options.stage === 'draft') {
        for (const item of items) {
          if (item.flowNodeNameCurrent) {
            item.flowNodeNameCurrentLocale = this.ctx.text(item.flowNodeNameCurrent);
          }
        }
      }
      // atomLanguage/atomDisabled
      for (const item of items) {
        if (item.atomLanguage) {
          item.atomLanguageLocale = this.ctx.text(item.atomLanguage);
        }
        await this._atomDisabledTranslate({ atomClass, item });
      }
    }

    async delete({ atomClass, key, options, user }) {
      // atomClass
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
      if (_atomClass.tag) {
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

    async write({ atomClass, target, key, item, options, user }) {
      if (!item) return;
      // force delete atomDisabled
      delete item.atomDisabled;
      // simple/stage
      const atomSimple = item.atomSimple;
      const atomStage = item.atomStage;
      // atomClass
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
      let _atomOld;
      if (_atomClass.tag && item.atomTags !== undefined && atomStage === 1) {
        _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      }
      // validate
      const ignoreValidate = options && options.ignoreValidate;
      if (
        ((atomSimple === 0 && atomStage === 0) || (atomSimple === 1 && atomStage === 1)) &&
        !target &&
        !ignoreValidate
      ) {
        this.ctx.bean.util.setProperty(this.ctx, 'meta.validateHost', {
          atomClass,
          key,
          options,
          user,
        });
        await this.ctx.bean.validation._validate({ atomClass, data: item, options, filterOptions: true });
        this.ctx.bean.util.setProperty(this.ctx, 'meta.validateHost', null);
      }
      // --- item is filtered by validation
      // write atom
      await this._writeAtom({ key, item, user, atomSimple, atomStage });
      // tag
      if (_atomClass.tag && item.atomTags !== undefined) {
        await this.ctx.bean.tag.updateTagRefs({ atomId: key.atomId, atomTags: item.atomTags });
        if (atomStage === 1) {
          await this.ctx.bean.tag.setTagAtomCount({ tagsNew: item.atomTags, tagsOld: _atomOld.atomTags });
        }
      }
      // handle resource
      await this._writeHandleResource({ _atomClass, key, item });
      // remove fields.custom
      const fieldsCustom = _atomClass.fields && _atomClass.fields.custom;
      if (fieldsCustom) {
        for (const field of fieldsCustom) {
          delete item[field];
        }
      }
    }

    async submit({ /* atomClass,*/ key, options, user }) {
      const ignoreFlow = options && options.ignoreFlow;
      const _atom = await this.ctx.bean.atom.read({ key, user });
      if (_atom.atomStage > 0) this.ctx.throw(403);
      // check atom flow
      if (!ignoreFlow) {
        const _nodeBaseBean = this.ctx.bean._newBean('a-flowtask.flow.node.startEventAtom');
        const flowInstance = await _nodeBaseBean._match({ atom: _atom, userId: _atom.userIdUpdated });
        if (flowInstance) {
          // set atom flow
          const atomFlowId = flowInstance.context._flowId;
          await this.ctx.bean.atom.flow({ key, atom: { atomFlowId } });
          // ok
          return { flow: { id: atomFlowId } };
        }
      }
      return await this.ctx.bean.atom._submitDirect({ key, item: _atom, options, user });
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

    async translateAreaScopeValue(/* { atomClass, areaScopeMeta, atomAreaKey, atomAreaValue }*/) {
      return { error: this.ctx.text('NotImplemented') };
    }
  }
  return AtomBase;
};
