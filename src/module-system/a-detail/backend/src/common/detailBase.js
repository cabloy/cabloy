module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailBase extends app.meta.BeanBase {

    async create({ atomKey, atomClass, item, user }) {
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

  }
  return DetailBase;
};
