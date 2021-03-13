const __detailBasicFields = [
  'detailCodeId', 'detailCode', 'detailName',
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
      // add
      const detailId = await this.ctx.bean.detail._add({ atomKey, detailClass, detail: item, user });
      return { detailId };
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

  }
  return DetailBase;
};
