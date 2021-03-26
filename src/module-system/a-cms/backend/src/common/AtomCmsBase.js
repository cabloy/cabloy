const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomCmsBase extends app.meta.AtomBase {

    get modelArticle() {
      return this.ctx.model.module(moduleInfo.relativeName).article;
    }

    get modelContent() {
      return this.ctx.model.module(moduleInfo.relativeName).content;
    }

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // article
      const site = await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite: true });
      const editMode = site.edit.mode;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
      // uuid
      params.uuid = item.uuid || uuid.v4().replace(/-/g, '');
      // insert
      await this.modelArticle.insert(params);
      // add content
      await this.modelContent.insert({
        atomId: key.atomId,
        content: '',
      });
      return { atomId: key.atomId };
    }

    async read({ atomClass, options, key, user }) {
      // get
      return await this.ctx.bean.atom._get({ atomClass, options, key, mode: 'full', user });
    }

    async select(/* {  atomClass, options, items, user }*/) {
      // donothing
    }

    async delete({ atomClass, key, user }) {
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
      // stage
      const atomStage = item.atomStage;
      // atomClass
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
      let _atomOld;
      if (_atomClass.tag && item.atomTags !== undefined && atomStage === 1) {
        _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      }
      // validate
      const ignoreValidate = options && options.ignoreValidate;
      if (atomStage === 0 && !target && !ignoreValidate) {
        await this.ctx.bean.validation._validate({ atomClass, data: item, options });
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
          // ok
          return { flow: { id: atomFlowId } };
        }
      }
      return await this.ctx.bean.atom._submitDirect({ key, item: _atom, options, user });
    }

    async enable({ /* atomClass,*/ key/* , user*/ }) {
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId, atomDisabled: 0,
      });
    }

    async disable({ /* atomClass,*/ key/* , user*/ }) {
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId, atomDisabled: 1,
      });
    }

    async copy(/* { atomClass, target, srcKey, srcItem, destKey, destItem, user }*/) {
      // do nothing
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
  return AtomCmsBase;
};
