const require3 = require('require3');
const uuid = require3('uuid');

// detailLineNo will be changed by other way
const __detailBasicFields = [
  'detailCodeId', 'detailCode', 'detailName',
  'detailStatic', 'detailStaticKey',
];

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailBase extends app.meta.BeanBase {

    async create({ atomKey, detailClass, item, user }) {
      // detailName
      if (!item.detailName) {
        // draftId
        const sequence = this.ctx.bean.sequence.module(moduleInfo.relativeName);
        const uniqueId = await sequence.next('detail');
        item.detailName = `${this.ctx.text('Detail')}-${uniqueId}`;
      }
      // detailStaticKey
      if (!item.detailStaticKey) {
        item.detailStaticKey = uuid.v4().replace(/-/g, '');
      }
      // detailLineNo
      item.detailLineNo = await this._createLineNo({ atomKey, detailClass });
      // add
      const detailId = await this.ctx.bean.detail._add({ atomKey, detailClass, detail: item, user });
      return { detailId };
    }

    async read({ detailClass, options, key, user }) {
      // get
      return await this.ctx.bean.detail._get({ detailClass, options, key, mode: 'full', user });
    }

    async select(/* {  atomKey, detailClass, options, items, user }*/) {
      // donothing
    }

    async delete({ /* detailClass, target, */ key, user }) {
      // delete
      await this.ctx.bean.detail._delete({
        detail: { id: key.detailId },
        user,
      });
    }

    async write({ detailClass, target, key, item, options, user }) {
      if (!item) return;
      // stage
      const atomStage = item.atomStage;
      // validate
      const ignoreValidate = options && options.ignoreValidate;
      if (atomStage === 0 && !target && !ignoreValidate) {
        await this.ctx.bean.validation._validate({ detailClass, data: item, options });
      }
      // write detail
      await this._writeDetail({ key, item, user, atomStage });
    }

    async _writeDetail({ key, item, user, atomStage }) {
      // write detail
      const detail = { };
      for (const field of __detailBasicFields) {
        if (item[field] !== undefined) detail[field] = item[field];
      }
      if (atomStage === 0) {
        detail.updatedAt = new Date();
      }
      // update
      detail.id = key.detailId;
      await this.ctx.bean.detail._update({ detail, user });
    }

    async copy(/* {
      detailClass, target, srcKey, srcItem, destKey, destItem, options, user,
      atomClass, srcKeyAtom, destKeyAtom, destAtom,
    }*/) {
      // do nothing
    }

    async _createLineNo({ atomKey, detailClass }) {
      // need not check atomStage
      const res = await this.ctx.model.queryOne(`
        select max(a.detailLineNo) as detailLineNo from aDetail a
          where a.iid=? and a.deleted=0 and a.atomId=? and a.detailClassId=?
        `, [ this.ctx.instance.id, atomKey.atomId, detailClass.id ]);
      const detailLineNo = res.detailLineNo;
      return detailLineNo ? detailLineNo + 1 : 1;
    }

  }
  return DetailBase;
};
