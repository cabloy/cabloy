const require3 = require('require3');
const ExcelJS = require3('exceljs');

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

    async write({ atomClass, key, item, options, user }) {
      const atomStage = item.atomStage;
      // validator
      if (atomStage === 0) {
        const optionsSchema = options && options.schema;
        if (optionsSchema) {
          await this.ctx.bean.validation.ajvFromSchemaAndValidate({
            module: optionsSchema.module,
            schema: optionsSchema.schema,
            data: item,
          });
        } else {
          const validator = await this.ctx.bean.atom.validator({ atomClass, user });
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
      // write atom
      await this._writeAtom({ key, item, user, atomStage });
    }

    async _writeAtom({ key, item, user, atomStage }) {
      if (!item || atomStage > 0) return;
      // write atom
      const atom = { };
      if (item.atomName !== undefined) atom.atomName = item.atomName;
      if (item.atomStatic !== undefined) atom.atomStatic = item.atomStatic;
      if (item.atomStaticKey !== undefined) atom.atomStaticKey = item.atomStaticKey;
      if (item.atomRevision !== undefined) atom.atomRevision = item.atomRevision;
      if (item.allowComment !== undefined) atom.allowComment = item.allowComment;
      atom.updatedAt = new Date();
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
