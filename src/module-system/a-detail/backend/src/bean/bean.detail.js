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

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async getDetailClassId({ module, detailClassName }) {
      const res = await this.detailClass.get({
        module,
        detailClassName,
      });
      return res.id;
    }

    async create({ atomKey, detailClass, item, user }) {
      // detailClass
      detailClass = await ctx.bean.detailClass.get(detailClass);
      // item
      item = item || { };
      // detail bean
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

    // read
    async read({ key, options, user }) {
      // detailClass
      const detailClass = await ctx.bean.detailClass.getByDetailId({ detailId: key.detailId });
      if (!detailClass) ctx.throw.module('a-base', 1002);
      // detail bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      const item = await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, options, key, user },
        fn: 'read',
      });
      // ok
      return item;
    }

    async select({ atomKey, options, user }) {
    }

    async count({ atomKey, options, user }) {
    }

    // write
    async write({ key, target, item, options, user }) {
      // detailClass
      const detailClass = await ctx.bean.detailClass.getByDetailId({ detailId: key.detailId });
      if (!detailClass) ctx.throw.module('a-base', 1002);
      if (!key.detailItemId) key.detailItemId = detailClass.detailItemId;
      // detail bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      // item draft
      const itemDraft = Object.assign({}, item, {
        detailId: key.detailId,
        detailItemId: key.detailItemId,
        atomStage: ctx.constant.module('a-base').atom.stage.draft,
      });
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, target, key, item: itemDraft, options, user },
        fn: 'write',
      });
    }

    // delete
    async delete({ key, user }) {
      const detailClass = await ctx.bean.detailClass.getByDetailId({ detailId: key.detailId });
      if (!detailClass) ctx.throw.module('a-base', 1002);
      if (!key.detailItemId) key.detailItemId = detailClass.detailItemId;
      // detail bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      // delete
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, key, user },
        fn: 'delete',
      });
    }

    async schema({ detailClass, schema }) {
      const validator = await this.validator({ detailClass });
      if (!validator) return null;
      return ctx.bean.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
    }

    async validator({ detailClass: { id } }) {
      const detailClass = await this.detailClass.get({ id });
      return await this.detailClass.validator({ detailClass });
    }

    // detail

    async _add({
      atomKey,
      detailClass: { id, detailClassName },
      detail: {
        detailItemId, detailName,
      },
      user,
    }) {
      let detailClassId = id;
      if (!detailClassId) detailClassId = await this.getDetailClassId({ detailClassName });
      const res = await this.modelDetail.insert({
        atomId: atomKey.atomId,
        detailItemId,
        detailClassId,
        detailName,
        userIdCreated: user.id,
        userIdUpdated: user.id,
      });
      return res.insertId;
    }

    async _update({ detail/* , user,*/ }) {
      await this.modelDetail.update(detail);
    }

    async _delete({ detail /* user,*/ }) {
      // aDetail
      await this.modelDetail.delete(detail);
    }

    async _get({ detailClass, options, key, mode/* , user*/ }) {
      if (!options) options = {};
      //
      const _detailClass = await ctx.bean.detailClass.detailClass(detailClass);
      const tableName = this._getTableName({ detailClass: _detailClass, mode });
      const sql = this.sqlProcedure.getDetail({
        iid: ctx.instance.id,
        tableName, detailId: key.detailId,
      });
      return await ctx.model.queryOne(sql);
    }

    _getTableName({ detailClass, mode }) {
      const tableNameModes = detailClass.tableNameModes || {};
      // not support search
      // if (mode === 'search') {
      //   return tableNameModes.search || tableNameModes.full || tableNameModes.default || detailClass.tableName;
      // }
      return tableNameModes[mode] || tableNameModes.default || detailClass.tableName;
    }


  }

  return Detail;
};
