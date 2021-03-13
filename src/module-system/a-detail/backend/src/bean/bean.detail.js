const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Detail extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'detail');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get detailClass() {
      return ctx.bean.detailClass.module(this.moduleName);
    }

    get modelDetail() {
      return ctx.model.module(moduleInfo.relativeName).detail;
    }

    async create({ atomKey, detailClass, item, user }) {
      // atomClass
      detailClass = await ctx.bean.detailClass.get(detailClass);
      // item
      item = item || { };
      // atom bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      const res = await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomKey, detailClass, item, user },
        fn: 'create',
      });
      const { detailId, detailItemId } = res;
      // save detailItemId
      await this._update({
        detail: { id: detailId, detailItemId },
        user,
      });
      // ok: detailKey
      return { detailId, detailItemId };
    }


  }

  return Detail;
};
