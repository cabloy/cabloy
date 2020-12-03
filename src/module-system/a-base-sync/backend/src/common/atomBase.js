const require3 = require('require3');
const uuid = require3('uuid');
const ExcelJS = require3('exceljs');

const __atomBasicFields = [
  'atomName', 'atomStatic', 'atomStaticKey', 'atomRevision',
  'atomLanguage', 'atomCategoryId', 'atomTags', 'allowComment',
];

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase extends app.meta.BeanBase {

    async create({ atomClass, item, user }) {
      // atomName
      if (!item.atomName) {
        // draftId
        const sequence = this.ctx.bean.sequence.module(moduleInfo.relativeName);
        const draftId = await sequence.next('draft');
        item.atomName = `${this.ctx.text('Draft')}-${draftId}`;
      }
      // atomStaticKey
      if (!item.atomStaticKey) {
        item.atomStaticKey = uuid.v4().replace(/-/g, '');
      }
      // add
      const atomId = await this.ctx.bean.atom._add({ atomClass, atom: item, user });
      return { atomId };
    }

    async read({ atomClass, options, key, user }) {
      // get
      return await this.ctx.bean.atom._get({ atomClass, options, key, mode: 'full', user });
    }

    async select(/* {  atomClass, options, items, user }*/) {
      // donothing
    }

    async delete({ /* atomClass,*/ key, user }) {
      await this.ctx.bean.atom._delete({
        atom: { id: key.atomId },
        user,
      });
    }

    async write({ atomClass, target, key, item, options, user }) {
      if (!item) return;
      // stage
      const atomStage = item.atomStage;
      // atomClass
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
      let _atomOld;
      if (_atomClass.tag && item.atomTags !== undefined && atomStage === 1) {
        _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      }
      // validate
      if (atomStage === 0 && !target) {
        await this._writeValidate({ atomClass, item, options });
      }
      // write atom
      await this._writeAtom({ key, item, user, atomStage });
      // tag
      if (_atomClass.tag && item.atomTags !== undefined) {
        await this.ctx.bean.tag.updateTagRefs({ atomId: key.atomId, atomTags: item.atomTags });
        if (atomStage === 1) {
          await this.ctx.bean.tag.setTagAtomCount({ tagsNew: item.atomTags, tagsOld: _atomOld.atomTags });
        }
      }
    }

    async _writeValidate({ atomClass, item, options }) {
      // validator
      const optionsSchema = options && options.schema;
      if (optionsSchema) {
        await this.ctx.bean.validation.ajvFromSchemaAndValidate({
          module: optionsSchema.module,
          schema: optionsSchema.schema,
          data: item,
        });
      } else {
        const validator = await this.ctx.bean.atom.validator({ atomClass });
        if (validator) {
          // if error throw 422
          await this.ctx.bean.validation.validate({
            module: validator.module,
            validator: validator.validator,
            schema: validator.schema,
            data: item,
          });
        }
      }
    }

    async _writeAtom({ key, item, user, atomStage }) {
      // write atom
      const atom = { };
      for (const field of __atomBasicFields) {
        if (item[field] !== undefined) atom[field] = item[field];
      }
      if (atomStage === 0) {
        atom.updatedAt = new Date();
      }
      // update
      atom.id = key.atomId;
      await this.ctx.bean.atom._update({ atom, user });
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
          return { flow: { id: atomFlowId } };
        }
      }
      return await this.ctx.bean.atom._submitDirect({ key, item: _atom, user });
    }

    async copy(/* { atomClass, target, srcKey, srcItem, destKey, destItem, user }*/) {
      // donothing
    }

    async exportBulk({ /* atomClass, options,*/ fields, items/* , user*/ }) {
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

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      return await this.ctx.bean.atom._checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
    }

  }
  return AtomBase;
};
