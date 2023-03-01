/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 456:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
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
      item = item || {};
      // detail bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      const res = await ctx.meta.util.executeBean({
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
      const item = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, options, key, user },
        fn: 'read',
      });
      // ok
      return item;
    }

    // readByStaticKey
    //   atomKey or atomStage must be set
    async readByStaticKey({ atomKey, detailClass, detailStaticKey, atomStage }) {
      const options = {
        mode: 'full',
        stage: atomStage,
        where: {
          'a.detailStaticKey': detailStaticKey,
        },
      };
      const list = await this.select({ atomKey, detailClass, options });
      return list[0];
    }

    async select({ atomKey, detailClass, options = {}, user, pageForce = false, count = 0 }) {
      // detailClass
      if (!detailClass) {
        // use default detail
        detailClass = await this.getDetailClassDefault({ atomId: atomKey.atomId });
      }
      detailClass = await ctx.bean.detailClass.get(detailClass);
      const _detailClass = await ctx.bean.detailClass.detailClass(detailClass);

      // tableName
      const tableName = this._getTableName({ detailClass: _detailClass, mode: options.mode });
      // 'where' should append atomClassId for safe
      if (!options.where) options.where = {};
      // atomKey maybe nulll
      if (atomKey) {
        options.where['a.atomId'] = atomKey.atomId;
      }
      options.where['a.detailClassId'] = detailClass.id;
      // atomStage
      if (options.stage === undefined) {
        // atom
        const atom = await ctx.bean.atom.modelAtom.get({ id: atomKey.atomId });
        options.stage = atom.atomStage;
      }
      // orders
      if (!options.orders || options.orders.length === 0) {
        options.orders = [['a.detailLineNo', 'asc']];
      }
      // select
      const items = await this._list({
        tableName,
        options,
        user,
        pageForce,
        count,
      });
      // select items
      if (!count) {
        const _moduleInfo = mparse.parseInfo(detailClass.module);
        const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomKey, detailClass, options, items, user },
          fn: 'select',
        });
      }
      // ok
      return items;
    }

    async count({ atomKey, detailClass, options, user }) {
      return await this.select({ atomKey, detailClass, options, user, count: 1 });
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
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, target, key, item: itemDraft, options, user },
        fn: 'write',
      });
    }

    // delete
    async delete({ key, target, user }) {
      const detailClass = await ctx.bean.detailClass.getByDetailId({ detailId: key.detailId });
      if (!detailClass) ctx.throw.module('a-base', 1002);
      if (!key.detailItemId) key.detailItemId = detailClass.detailItemId;
      // delete
      await this._delete2({ detailClass, key, target, user });
    }

    async clone({ key, user }) {
      const srcItem = await this.read({ key, options: null, user });
      const srcKeyAtom = { atomId: srcItem.atomId };
      const destKeyAtom = srcKeyAtom;
      const keyDest = await this._copyDetail({
        srcKey: key,
        srcItem,
        destKey: null,
        detailClass: null,
        atomClass: null,
        target: 'clone',
        srcKeyAtom,
        destKeyAtom,
        destAtom: null,
        options: null,
        user,
      });
      // ok
      return keyDest;
    }

    async moveUp({ key, user }) {
      return await this._moveLineNo({ key, user, direction: 'up' });
    }

    async moveDown({ key, user }) {
      return await this._moveLineNo({ key, user, direction: 'down' });
    }

    async _moveLineNo({ key, user, direction }) {
      // from
      const detailFrom = await this.modelDetail.get({ id: key.detailId });
      // sql
      let sql;
      if (direction === 'up') {
        sql = `select a.id,a.detailLineNo from aDetail a
          where a.iid=? and a.deleted=0 and a.atomId=? and a.detailClassId=? and a.detailLineNo<?
          order by detailLineNo desc`;
      } else {
        sql = `select a.id,a.detailLineNo from aDetail a
          where a.iid=? and a.deleted=0 and a.atomId=? and a.detailClassId=? and a.detailLineNo>?
          order by detailLineNo asc`;
      }
      // to
      const detailTo = await ctx.model.queryOne(sql, [
        ctx.instance.id,
        detailFrom.atomId,
        detailFrom.detailClassId,
        detailFrom.detailLineNo,
      ]);
      if (!detailTo) {
        // do nothing
        return null;
      }
      // switch
      await this.modelDetail.update({ id: key.detailId, detailLineNo: detailTo.detailLineNo });
      await this.modelDetail.update({ id: detailTo.id, detailLineNo: detailFrom.detailLineNo });
      // ok
      return {
        from: key.detailId,
        to: detailTo.id,
      };
    }

    async _delete2({ detailClass, key, target, user }) {
      // detail bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      // delete
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, target, key, user },
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

    async getDetailClassDefault({ atomId }) {
      // use default
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const detailDefault = _atomClass.details && _atomClass.details[0];
      if (!detailDefault) return null;
      return this._prepareDetailClassFromName({
        atomClass,
        detailClassName: detailDefault,
      });
    }

    _prepareDetailClassFromName({ atomClass, detailClassName }) {
      if (typeof detailClassName === 'string') {
        return {
          module: atomClass.module,
          detailClassName,
        };
      }
      return {
        module: detailClassName.module || atomClass.module,
        detailClassName: detailClassName.detailClassName,
      };
    }

    async _loopDetailClasses({ atomClass, fn }) {
      // all details of atom
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const detailClassNames = _atomClass.details;
      if (!detailClassNames) return; // do nothing
      // loop
      for (const detailClassName of detailClassNames) {
        let detailClass = this._prepareDetailClassFromName({ atomClass, detailClassName });
        detailClass = await this.detailClass.get(detailClass);
        await fn({ detailClass });
      }
    }

    async _deleteDetails({ atomClass, atomKey, user }) {
      await this._loopDetailClasses({
        atomClass,
        fn: async ({ detailClass }) => {
          await this._deleteDetails_Class({ detailClass, atomClass, atomKey, user });
        },
      });
    }

    async _deleteDetails_Class({ detailClass, atomKey, user }) {
      // details
      const details = await this.modelDetail.select({
        where: {
          atomId: atomKey.atomId,
          detailClassId: detailClass.id,
        },
      });
      // loop
      for (const detail of details) {
        // delete
        const key = { detailId: detail.id, detailItemId: detail.detailItemId };
        await this._delete2({ detailClass, key, user });
      }
    }

    async _copyDetails({ atomClass, target, srcKeyAtom, destKeyAtom, destAtom, options, user }) {
      await this._loopDetailClasses({
        atomClass,
        fn: async ({ detailClass }) => {
          await this._copyDetails_Class({
            detailClass,
            atomClass,
            target,
            srcKeyAtom,
            destKeyAtom,
            destAtom,
            options,
            user,
          });
        },
      });
    }

    async _copyDetails_Class({ detailClass, atomClass, target, srcKeyAtom, destKeyAtom, destAtom, options, user }) {
      // details dest
      const detailsDest = await this.modelDetail.select({
        where: {
          atomId: destKeyAtom.atomId,
          detailClassId: detailClass.id,
        },
      });
      // details src
      const detailsSrc = await this.select({
        atomKey: { atomId: srcKeyAtom.atomId },
        detailClass,
        options: {
          mode: 'full',
        },
        user,
      });
      // loop
      for (const detailDest of detailsDest) {
        const indexSrc = detailsSrc.findIndex(item => item.detailStaticKey === detailDest.detailStaticKey);
        if (indexSrc === -1) {
          // delete
          const key = { detailId: detailDest.id, detailItemId: detailDest.detailItemId };
          await this._delete2({ detailClass, key, target, user });
        } else {
          // write
          const srcItem = detailsSrc[indexSrc];
          const srcKey = { detailId: srcItem.detailId, detailItemId: srcItem.detailItemId };
          const destKey = { detailId: detailDest.id, detailItemId: detailDest.detailItemId };
          await this._copyDetail({
            srcKey,
            srcItem,
            destKey,
            detailClass,
            atomClass,
            target,
            srcKeyAtom,
            destKeyAtom,
            destAtom,
            options,
            user,
          });
          // delete src
          detailsSrc.splice(indexSrc, 1);
        }
      }
      // append the remains
      for (const srcItem of detailsSrc) {
        const srcKey = { detailId: srcItem.detailId, detailItemId: srcItem.detailItemId };
        await this._copyDetail({
          srcKey,
          srcItem,
          detailClass,
          atomClass,
          target,
          srcKeyAtom,
          destKeyAtom,
          destAtom,
          options,
          user,
        });
      }
    }

    // target: draft/formal/history/clone
    async _copyDetail({
      srcKey,
      srcItem,
      destKey,
      detailClass,
      atomClass,
      target,
      srcKeyAtom,
      destKeyAtom,
      destAtom,
      options,
      user,
    }) {
      // detailClass
      if (!detailClass) {
        detailClass = await ctx.bean.detailClass.getByDetailId({ detailId: srcKey.detailId });
      }
      // detail bean
      const _moduleInfo = mparse.parseInfo(detailClass.module);
      const _detailClass = ctx.bean.detailClass.detailClass(detailClass);
      const beanFullName = `${_moduleInfo.relativeName}.detail.${_detailClass.bean}`;
      // destKey
      if (!destKey) {
        destKey = await this.create({ atomKey: destKeyAtom, detailClass, item: null, user });
      }
      // atomStage
      const atomStage = ctx.constant.module('a-base').atom.stage[target] || 0;
      // detail
      let userIdUpdated = srcItem.userIdUpdated;
      let userIdCreated = srcItem.userIdCreated || userIdUpdated;
      const detailCodeId = srcItem.detailCodeId;
      const detailCode = srcItem.detailCode;
      let detailName = srcItem.detailName;
      const detailLineNo = srcItem.detailLineNo;
      let detailStatic = srcItem.detailStatic;
      let detailStaticKey = srcItem.detailStaticKey;
      if (target === 'draft') {
        userIdUpdated = user.id;
      } else if (target === 'formal') {
        // do nothing
      } else if (target === 'history') {
        // do nothing
      } else if (target === 'clone') {
        userIdUpdated = user.id;
        userIdCreated = user.id;
        if (srcKeyAtom.atomId === destKeyAtom.atomId) {
          detailName = `${srcItem.detailName}-${ctx.text('CloneCopyText')}`;
        } else {
          detailName = srcItem.detailName;
        }
        detailStatic = 0;
        if (detailStaticKey) {
          detailStaticKey = ctx.bean.util.uuidv4();
        }
      }
      // destItem
      const destItem = Object.assign({}, srcItem, {
        atomId: destKeyAtom.atomId,
        atomStage,
        detailId: destKey.detailId,
        detailItemId: destKey.detailItemId,
        userIdCreated,
        userIdUpdated,
        detailCodeId,
        detailCode,
        detailName,
        detailLineNo,
        detailStatic,
        detailStaticKey,
        createdAt: srcItem.atomCreatedAt,
        updatedAt: srcItem.atomUpdatedAt,
      });
      // update fields
      const params = {
        id: destItem.detailId,
        userIdCreated: destItem.userIdCreated,
        userIdUpdated: destItem.userIdUpdated,
        //   see also: detailBase
        // detailCodeId: destItem.detailCodeId,
        // detailCode: destItem.detailCode,
        // detailName: destItem.detailName,
        // detailStatic: destItem.detailStatic,
        // detailStaticKey: destItem.detailStaticKey,
        atomStage: destItem.atomStage,
        createdAt: destItem.detailCreatedAt,
        updatedAt: destItem.detailUpdatedAt,
      };
      if (target !== 'clone') {
        params.detailLineNo = destItem.detailLineNo;
      }
      await this.modelDetail.update(params);
      // detail write
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { detailClass, target, key: destKey, item: destItem, options, user },
        fn: 'write',
      });
      // detail copy
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: {
          detailClass,
          target,
          srcKey,
          srcItem,
          destKey,
          destItem,
          options,
          user,
          atomClass,
          srcKeyAtom,
          destKeyAtom,
          destAtom,
        },
        fn: 'copy',
      });
      // ok
      return destKey;
    }

    // detail

    async _add({
      atomKey,
      detailClass: { id, detailClassName },
      detail: { detailItemId, detailName, detailLineNo, detailStatic = 0, detailStaticKey = null },
      user,
    }) {
      let detailClassId = id;
      if (!detailClassId) detailClassId = await this.getDetailClassId({ detailClassName });
      const res = await this.modelDetail.insert({
        atomId: atomKey.atomId,
        detailItemId,
        detailClassId,
        detailName,
        detailLineNo,
        detailStatic,
        detailStaticKey,
        userIdCreated: user.id,
        userIdUpdated: user.id,
      });
      return res.insertId;
    }

    async _update({ detail /* , user,*/ }) {
      await this.modelDetail.update(detail);
    }

    async _delete({ detail /* user,*/ }) {
      // aDetail
      await this.modelDetail.delete(detail);
    }

    async _get({ detailClass, options, key, mode /* , user*/ }) {
      if (!options) options = {};
      //
      const _detailClass = await ctx.bean.detailClass.detailClass(detailClass);
      const tableName = this._getTableName({ detailClass: _detailClass, mode });
      const sql = this.sqlProcedure.getDetail({
        iid: ctx.instance.id,
        tableName,
        detailId: key.detailId,
      });
      return await ctx.model.queryOne(sql);
    }

    async _list({ tableName, options: { where, orders, page, stage }, /* user,*/ pageForce = false, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);
      stage = typeof stage === 'number' ? stage : ctx.constant.module('a-base').atom.stage[stage];
      const sql = this.sqlProcedure.selectDetails({
        iid: ctx.instance.id,
        tableName,
        where,
        orders,
        page,
        count,
        stage,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    _getTableName({ detailClass, mode }) {
      const tableNameModes = detailClass.tableNameModes || {};
      // not support search
      // if (mode === 'search') {
      //   return tableNameModes.search || tableNameModes.full || tableNameModes.default || detailClass.tableName;
      // }
      return tableNameModes[mode] || tableNameModes.default || detailClass.tableName;
    }

    // right

    async actions({ flowTaskId, atomKey, detailClass, mode, user }) {
      return await this._actions({ flowTaskId, atomKey, detailClass, mode, user, bulk: false });
    }

    async actionsBulk({ flowTaskId, atomKey, detailClass, mode, user }) {
      return await this._actions({ flowTaskId, atomKey, detailClass, mode, user, bulk: true });
    }

    async _actions({ flowTaskId, atomKey, detailClass, mode, user, bulk }) {
      // atom
      const atomId = atomKey.atomId;
      const atom = await ctx.bean.atom.modelAtom.get({ id: atomId });
      // actionsAll
      let actionsAll = ctx.bean.detailAction.actions();
      actionsAll = actionsAll[detailClass.module][detailClass.detailClassName];
      // actions of mode
      let _actions = [];
      for (const name in actionsAll) {
        const action = actionsAll[name];
        if (action.authorize === false) continue;
        if (!!action.bulk === bulk && (!action.mode || action.mode === mode)) {
          _actions.push(action);
        }
      }
      // sort
      _actions = _actions.sort((a, b) => a.code - b.code);
      // inherit: read/others
      const res = [];
      const rights = [];
      for (const actionBase of _actions) {
        let right = rights[actionBase.inherit];
        if (right === undefined) {
          if (actionBase.inherit === 'read') {
            right = await this._checkRightRead({ flowTaskId, detailClass, atomId, atom, actionBase, user });
          } else {
            right = await this._checkRightAction({ flowTaskId, detailClass, atomId, atom, actionBase, user });
          }
          rights[actionBase.inherit] = right;
        }
        if (right) {
          res.push({
            ...actionBase,
            module: detailClass.module,
            detailClassName: detailClass.detailClassName,
          });
        }
      }
      // ok
      return res;
    }

    _checkSchemaValid({ schema, detailClass }) {
      for (const key in schema.properties) {
        const property = schema.properties[key];
        if (
          property.ebType === 'details' &&
          property.ebParams.detailClass.module === detailClass.module &&
          property.ebParams.detailClass.detailClassName === detailClass.detailClassName
        ) {
          return true;
        }
      }
      return false;
    }

    async _checkRightRead({ flowTaskId, detailClass, atomId, atom, actionBase, user }) {
      // special check for stage
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => ctx.constant.module('a-base').atom.stage[item] === atom.atomStage)) return false;
      }
      // special check for flow
      if (atom.atomStage === 0 && atom.atomFlowId > 0 && flowTaskId) {
        const viewAtom = await ctx.bean.flowTask.viewAtom({ flowTaskId, user });
        if (!viewAtom) return false;
        if (viewAtom.item.atomId !== atomId) return false;
        if (this._checkSchemaValid({ schema: viewAtom.schema.schema, detailClass })) return true;
        // default is false
        return false;
      }
      // atom read
      return !!(await ctx.bean.atom.checkRightRead({
        atom: { id: atomId },
        user,
        checkFlow: false,
      }));
    }

    async _checkRightAction({ flowTaskId, detailClass, atomId, atom, actionBase, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({ id: atom.atomClassId });
      const atomActionBase = ctx.bean.base.action({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        name: actionBase.inherit,
      });
      // special check for stage
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => ctx.constant.module('a-base').atom.stage[item] === atom.atomStage)) return false;
      }
      // special check write for flow
      if (actionBase.inherit === 'write') {
        if (atom.atomStage === 0 && atom.atomFlowId > 0 && flowTaskId) {
          const editAtom = await ctx.bean.flowTask.editAtom({ flowTaskId, user });
          if (!editAtom) return false;
          if (editAtom.item.atomId !== atomId) return false;
          if (this._checkSchemaValid({ schema: editAtom.schema.schema, detailClass })) return true;
          // default is false
          return false;
        }
      }
      // atom action
      return !!(await ctx.bean.atom.checkRightAction({
        atom: { id: atomId },
        action: atomActionBase.code,
        // need not set stage
        // stage,
        user,
        checkFlow: false,
      }));
    }

    async _checkRight({ flowTaskId, atomId, detailClass, action, user }) {
      // detailClass
      if (!detailClass) {
        // use default detail
        detailClass = await this.getDetailClassDefault({ atomId });
      }
      // parse action code
      action = ctx.bean.detailAction.parseActionCode({
        action,
        detailClass,
      });
      // actionBase
      const actionBase = ctx.bean.detailAction.action({
        module: detailClass.module,
        detailClassName: detailClass.detailClassName,
        code: action,
      });
      // atom
      const atom = await ctx.bean.atom.modelAtom.get({ id: atomId });
      // inherit
      const inherit = actionBase.inherit;
      // read
      if (inherit === 'read') {
        return await this._checkRightRead({ flowTaskId, detailClass, atomId, atom, actionBase, user });
      }
      // write or others
      return await this._checkRightAction({ flowTaskId, detailClass, atomId, atom, actionBase, user });
    }

    // right
    async _checkRightForMiddleware({ options }) {
      const action = options.action;
      // atomId/detailClass
      let atomId;
      let detailClass;
      // check key first
      const key = ctx.request.body.key;
      if (key) {
        const detailId = key.detailId;
        const detail = await this.modelDetail.get({ id: detailId });
        if (!detail) ctx.throw(403);
        atomId = detail.atomId;
        // detailClass
        detailClass = await ctx.bean.detailClass.getByDetailId({ detailId });
        if (!detailClass) ctx.throw.module('a-base', 1002);
        // for safe
        if (ctx.request.body.atomKey) {
          ctx.request.body.atomKey = { atomId };
        }
        if (ctx.request.body.detailClass) {
          ctx.request.body.detailClass = detailClass;
        }
      } else {
        // atomKey must be set
        atomId = ctx.request.body.atomKey && ctx.request.body.atomKey.atomId;
        if (!atomId) ctx.throw(403);
        // detailClass maybe empty
        detailClass = ctx.request.body.detailClass;
        if (!detailClass) {
          // use default detail
          detailClass = await this.getDetailClassDefault({ atomId });
        }
      }
      // _checkdetailClassExpect
      await _checkDetailClassExpect({ detailClass, options, ctx });
      // flowTaskId
      const flowTaskId = ctx.request.body.flowTaskId;
      // check
      const res = await this._checkRight({
        flowTaskId,
        atomId,
        detailClass,
        action,
        user: ctx.state.user.op,
      });
      if (!res) ctx.throw(403);
    }
  }

  return Detail;
};

function _parseDetailClass(detailClass) {
  if (!detailClass) return detailClass;
  if (typeof detailClass === 'string') {
    const [module, detailClassName] = detailClass.split(':');
    return { module, detailClassName };
  }
  return detailClass;
}

function _checkIfSameDetailClass(detailClassA, detailClassB) {
  return detailClassA.module === detailClassB.module && detailClassA.detailClassName === detailClassB.detailClassName;
}

async function _checkDetailClassExpect({ detailClass, options, ctx }) {
  // detailClassExpect
  const detailClassExpect = _parseDetailClass(options.detailClass);
  //
  if (!detailClass && !detailClassExpect) ctx.throw(403);
  if (detailClass && detailClassExpect && !_checkIfSameDetailClass(detailClass, detailClassExpect)) {
    ctx.throw(403);
  }
}


/***/ }),

/***/ 619:
/***/ ((module) => {

const _actions = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailAction extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'detailAction');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    action({ module, detailClassName, code, name }) {
      const _actions = this.actions();
      const actions = _actions[module][detailClassName];
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    parseActionCode({ action, detailClass }) {
      // is number
      if (!isNaN(action)) return parseInt(action);
      // add role right
      const actionCode = ctx.constant.module('a-detail').detail.action[action];
      if (actionCode) return actionCode;
      // detailClass
      if (!detailClass) throw new Error(`should specify the detailClass of action: ${action}`);
      const actions = this.actions();
      const _action = actions[detailClass.module][detailClass.detailClassName][action];
      if (!_action) {
        throw new Error(`detail action not found: ${detailClass.module}:${detailClass.detailClassName}.${action}`);
      }
      return _action.code;
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const details = ctx.bean.util.getProperty(module, 'main.meta.detail.details');
        if (details) {
          const res = {};
          for (const detailClassName in details) {
            const res2 = this._prepareActionsDetailClass(module, details[detailClassName]);
            if (Object.keys(res2).length > 0) {
              res[detailClassName] = res2;
            }
          }
          if (Object.keys(res).length > 0) {
            actions[relativeName] = res;
          }
        }
      }
      return actions;
    }

    _prepareActionsDetailClass(module, detailClass) {
      const actions = {};
      const _actions = detailClass.actions;
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).detail.action;
      const _actionsSystemMeta = ctx.constant.module(moduleInfo.relativeName).detail.actionMeta;
      const _actionsAll = ctx.bean.util.extend({}, _actionsSystemMeta, _actions);
      for (const key in _actionsAll) {
        if (key === 'custom') continue;
        const action = _actionsAll[key];
        if (!action.code) action.code = _actionsSystem[key];
        action.name = key;
        action.titleLocale = ctx.text(action.title);
        actions[key] = action;
      }
      return actions;
    }
  }

  return DetailAction;
};


/***/ }),

/***/ 44:
/***/ ((module) => {

const _detailClasses = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailClass extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'detailClass');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).detailClass;
    }

    detailClasses() {
      if (!_detailClasses[ctx.locale]) {
        _detailClasses[ctx.locale] = this._prepareDetailClasses();
      }
      return _detailClasses[ctx.locale];
    }

    detailClass({ module, detailClassName }) {
      const _detailClasses = this.detailClasses();
      return _detailClasses[module] && _detailClasses[module][detailClassName];
    }

    async get({ id, module, detailClassName }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, detailClassName };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !detailClassName) ctx.throw.module('a-base', 1011);
      // lock
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.detailClass.register`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'detailClass',
            context: { module, detailClassName },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ module, detailClassName }) {
      // get
      const res = await this.model.get({ module, detailClassName });
      if (res) return res;
      // data
      const atomClass = this.detailClass({ module, detailClassName });
      if (!atomClass) throw new Error(`detailClass ${module}:${detailClassName} not found!`);
      const data = {
        module,
        detailClassName,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async getByDetailId({ detailId }) {
      const res = await this.model.query(
        `
        select a.*,b.id as detailId,b.detailItemId from aDetailClass a
          left join aDetail b on a.id=b.detailClassId
            where b.iid=? and b.id=?
        `,
        [ctx.instance.id, detailId]
      );
      return res[0];
    }

    async validator({ detailClass }) {
      // default
      const _module = ctx.app.meta.modules[detailClass.module];
      const validator = _module.main.meta.detail.details[detailClass.detailClassName].validator;
      if (!validator) return null;
      return {
        module: detailClass.module,
        validator,
      };
    }

    _prepareDetailClasses() {
      const detailClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const details = ctx.bean.util.getProperty(module, 'main.meta.detail.details');
        if (details) {
          const res = this._prepareDetailClassesModule(module, details);
          if (Object.keys(res).length > 0) {
            detailClasses[relativeName] = res;
          }
        }
      }
      return detailClasses;
    }

    _prepareDetailClassesModule(module, _details) {
      const detailClasses = {};
      for (const key in _details) {
        // info
        const detailClass = {
          name: key,
          ..._details[key].info,
        };
        // titleLocale
        detailClass.titleLocale = ctx.text(detailClass.title);
        // ok
        detailClasses[key] = detailClass;
      }
      return detailClasses;
    }
  }

  return DetailClass;
};


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = ctx => {
  class Procedure {
    selectDetails({ iid, tableName, where, orders, page, count, stage }) {
      // -- tables
      // -- a: aDetail
      // -- b: aDetailClass
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser

      iid = parseInt(iid);
      stage = parseInt(stage);

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _itemField, _itemJoin;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.detailId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField}
                a.id as detailId,a.atomId,a.atomStage,a.detailItemId,a.detailClassId,
                a.detailCodeId,a.detailCode,a.detailName,a.detailLineNo,
                a.detailStatic,a.detailStaticKey,
                a.userIdCreated,a.userIdUpdated,a.createdAt as detailCreatedAt,a.updatedAt as detailUpdatedAt,
                b.module,b.detailClassName,
                g.userName,g.avatar,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                `;
      }

      // sql
      const _sql = `select ${_selectFields} from aDetail a
            inner join aDetailClass b on a.detailClassId=b.id
            left join aUser g on a.userIdCreated=g.id
            left join aUser g2 on a.userIdUpdated=g2.id
            ${_itemJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid} and a.atomStage=${stage}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    getDetail({ iid, tableName, detailId }) {
      // -- tables
      // -- a: aDetail
      // -- b: aDetailClass
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;

      iid = parseInt(iid);
      detailId = parseInt(detailId);

      // vars
      let _itemField, _itemJoin;

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.detailId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // sql
      const _sql = `select ${_itemField}
                a.id as detailId,a.atomId,a.atomStage,a.detailItemId,a.detailClassId,
                a.detailCodeId,a.detailCode,a.detailName,a.detailLineNo,
                a.detailStatic,a.detailStaticKey,
                a.userIdCreated,a.userIdUpdated,a.createdAt as detailCreatedAt,a.updatedAt as detailUpdatedAt,
                b.module,b.detailClassName,
                g.userName,g.avatar,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
          from aDetail a

            inner join aDetailClass b on a.detailClassId=b.id
            left join aUser g on a.userIdCreated=g.id
            left join aUser g2 on a.userIdUpdated=g2.id
            ${_itemJoin}

          where a.id=${detailId}
            and a.deleted=0 and a.iid=${iid}
        `;

      // ok
      return _sql;
    }
  }

  return Procedure;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aDetail
        let sql = `
          CREATE TABLE aDetail (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            atomStage int(11) DEFAULT '0',
            detailItemId int(11) DEFAULT '0',
            detailClassId int(11) DEFAULT '0',
            detailCodeId int(11) DEFAULT '0',
            detailCode varchar(255) DEFAULT NULL,
            detailName varchar(255) DEFAULT NULL,
            detailLineNo int(11) DEFAULT '0',
            detailStatic int(11) DEFAULT '0',
            detailStaticKey varchar(255) DEFAULT NULL,
            userIdCreated int(11) DEFAULT '0',
            userIdUpdated int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aDetailClass
        sql = `
          CREATE TABLE aDetailClass (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            detailClassName varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const localProcedure = __webpack_require__(716);
const beanDetail = __webpack_require__(456);
const beanDetailClass = __webpack_require__(44);
const beanDetailAction = __webpack_require__(619);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // global
    detail: {
      mode: 'ctx',
      bean: beanDetail,
      global: true,
    },
    detailClass: {
      mode: 'ctx',
      bean: beanDetailClass,
      global: true,
    },
    detailAction: {
      mode: 'ctx',
      bean: beanDetailAction,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 616:
/***/ ((module) => {

// detailLineNo will be changed by other way
const __detailBasicFields = ['detailCodeId', 'detailCode', 'detailName', 'detailStatic', 'detailStaticKey'];

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
        item.detailStaticKey = this.ctx.bean.util.uuidv4();
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
        this.ctx.bean.util.setProperty(this.ctx, 'meta.validateHost', {
          detailClass,
          key,
        });
        await this.ctx.bean.validation._validate({ detailClass, data: item, options, filterOptions: true });
        this.ctx.bean.util.setProperty(this.ctx, 'meta.validateHost', null);
      }
      // write detail
      await this._writeDetail({ key, item, user, atomStage });
    }

    async _writeDetail({ key, item, user, atomStage }) {
      // write detail
      const detail = {};
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
      const res = await this.ctx.model.queryOne(
        `
        select max(a.detailLineNo) as detailLineNo from aDetail a
          where a.iid=? and a.deleted=0 and a.atomId=? and a.detailClassId=?
        `,
        [this.ctx.instance.id, atomKey.atomId, detailClass.id]
      );
      const detailLineNo = res.detailLineNo;
      return detailLineNo ? detailLineNo + 1 : 1;
    }

    _ensureItemMeta(item) {
      if (!item) return null;
      if (!item._meta) item._meta = {};
      if (!item._meta.flags) item._meta.flags = [];
      return item._meta;
    }
  }
  return DetailBase;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {};

  return config;
};


/***/ }),

/***/ 479:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return {
    detail: {
      action: {
        create: 1,
        read: 2,
        write: 3,
        delete: 4,
        clone: 5,
        moveUp: 6,
        moveDown: 7,

        save: 51,

        custom: 100, // custom action start from custom
      },
      actionMeta: {
        create: {
          title: 'Create',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          bulk: true,
          icon: { f7: '::add' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        read: {
          title: 'View',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { f7: '::visibility' },
          inherit: 'read',
          mode: 'view',
          stage: '',
        },
        write: {
          title: 'Edit',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { f7: '::edit' },
          color: 'orange',
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnSwipeout: true,
          directShowOnList: true,
        },
        delete: {
          title: 'Delete',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { f7: '::delete' },
          color: 'red',
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnSwipeout: true,
          directShowOnList: true,
        },
        clone: {
          title: 'Clone',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { f7: ':outline:copy-outline' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        moveUp: {
          title: 'Move Up',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { f7: '::arrow-up' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnList: true,
          disableOnItem: true,
        },
        moveDown: {
          title: 'Move Down',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { f7: '::arrow-down' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnList: true,
          disableOnItem: true,
        },
        save: {
          title: 'Save',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          authorize: false,
          icon: { f7: '::save' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        custom: {
          title: 'Custom',
        },
      },
    },
  };
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 297:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
          edit: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      default: {
        subnavbar: false,
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutDetailItemBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 6,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 251:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'table',
          large: 'table',
        },
      },
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-detail',
              name: 'listLayoutBlockListTitle',
            },
          },
        },
      },
      list: {
        title: 'LayoutList',
        component: {
          module: 'a-detail',
          name: 'listLayoutList',
        },
        blocks: {
          items: {
            component: {
              module: 'a-detail',
              name: 'listLayoutBlockListItems',
            },
          },
        },
      },
      table: {
        title: 'LayoutTable',
        component: {
          module: 'a-detail',
          name: 'listLayoutTable',
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            enableTableHeight: false,
            sorter: false,
            columns: [
              {
                dataIndex: 'detailLineNo',
                title: '#',
                align: 'center',
                width: 50,
                component: {
                  module: 'a-detail',
                  name: 'listLayoutTableCellDetailLineNo',
                },
              },
              {
                dataIndex: 'detailName',
                title: 'Name',
                align: 'left',
                component: {
                  module: 'a-detail',
                  name: 'listLayoutTableCellDetailName',
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutDetailListBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 5,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutDetailItemBase = __webpack_require__(297);
const layoutDetailListBase = __webpack_require__(251);

module.exports = app => {
  const layouts = [layoutDetailItemBase(app), layoutDetailListBase(app)];
  return layouts;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 338:
/***/ ((module) => {

module.exports = app => {
  class BaseController extends app.Controller {
    detailClasses() {
      const res = this.ctx.service.base.detailClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }
  }

  return BaseController;
};


/***/ }),

/***/ 982:
/***/ ((module) => {

module.exports = app => {
  class DetailController extends app.Controller {
    async create() {
      const res = await this.ctx.service.detail.create({
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.detail.read({
        key: this.ctx.request.body.key,
        options: this.ctx.request.body.options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    // options
    //   where, orders, page, star, label
    async select() {
      const options = this.ctx.request.body.options || {};
      options.page = this.ctx.bean.util.page(options.page, false); // false
      const items = await this.ctx.service.detail.select({
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options || {};
      const count = await this.ctx.service.detail.count({
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

    async write() {
      const options = { ignoreValidate: false };
      await this.ctx.service.detail.write({
        key: this.ctx.request.body.key,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
        options,
      });
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.detail.delete({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success();
    }

    async clone() {
      const res = await this.ctx.service.detail.clone({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async moveUp() {
      const res = await this.ctx.service.detail.moveUp({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async moveDown() {
      const res = await this.ctx.service.detail.moveDown({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async actions() {
      const res = await this.ctx.service.detail.actions({
        flowTaskId: this.ctx.request.body.flowTaskId,
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        mode: this.ctx.request.body.mode,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async actionsBulk() {
      const res = await this.ctx.service.detail.actionsBulk({
        flowTaskId: this.ctx.request.body.flowTaskId,
        atomKey: this.ctx.request.body.atomKey,
        detailClass: this.ctx.request.body.detailClass,
        mode: this.ctx.request.body.mode,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async validator() {
      const res = await this.ctx.service.detail.validator({
        detailClass: this.ctx.request.body.detailClass,
      });
      this.ctx.success(res);
    }
  }
  return DetailController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const base = __webpack_require__(338);
const detail = __webpack_require__(982);

module.exports = app => {
  const controllers = {
    base,
    detail,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const DetailBaseFn = __webpack_require__(616);

module.exports = app => {
  // detailBase
  app.meta.DetailBase = DetailBaseFn(app);

  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // constants
  const constants = __webpack_require__(479)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    constants,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const staticLayouts = __webpack_require__(512)(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    sequence: {
      providers: {
        detail: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
  };
  return meta;
};


/***/ }),

/***/ 423:
/***/ ((module) => {

module.exports = app => {
  class Detail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDetail', options: { disableDeleted: false } });
    }
  }

  return Detail;
};


/***/ }),

/***/ 980:
/***/ ((module) => {

module.exports = app => {
  class DetailClass extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDetailClass', options: { disableDeleted: false } });
    }
  }

  return DetailClass;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const detail = __webpack_require__(423);
const detailClass = __webpack_require__(980);

module.exports = app => {
  const models = {
    detail,
    detailClass,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // base
    { method: 'post', path: 'base/detailClasses', controller: 'base' },
    { method: 'post', path: 'base/actions', controller: 'base' },
    // detail
    {
      method: 'post',
      path: 'detail/create',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'create' } },
    },
    { method: 'post', path: 'detail/read', controller: 'detail', meta: { right: { type: 'detail', action: 'read' } } },
    {
      method: 'post',
      path: 'detail/select',
      controller: 'detail',
      meta: { right: { type: 'detail', action: 'read' } },
    },
    { method: 'post', path: 'detail/count', controller: 'detail', meta: { right: { type: 'detail', action: 'read' } } },
    {
      method: 'post',
      path: 'detail/write',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'write' } },
    },
    {
      method: 'post',
      path: 'detail/delete',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'delete' } },
    },
    {
      method: 'post',
      path: 'detail/clone',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'clone' } },
    },
    {
      method: 'post',
      path: 'detail/moveUp',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'moveUp' } },
    },
    {
      method: 'post',
      path: 'detail/moveDown',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'moveDown' } },
    },
    { method: 'post', path: 'detail/actions', controller: 'detail' },
    { method: 'post', path: 'detail/actionsBulk', controller: 'detail' },
    { method: 'post', path: 'detail/validator', controller: 'detail' },
  ];
  return routes;
};


/***/ }),

/***/ 589:
/***/ ((module) => {

module.exports = app => {
  class Base extends app.Service {
    detailClasses() {
      return this.ctx.bean.detailClass.detailClasses();
    }

    actions() {
      return this.ctx.bean.detailAction.actions();
    }
  }

  return Base;
};


/***/ }),

/***/ 454:
/***/ ((module) => {

module.exports = app => {
  class Detail extends app.Service {
    async create({ atomKey, detailClass, item, user }) {
      return await this.ctx.bean.detail.create({ atomKey, detailClass, item, user });
    }

    async read({ key, options, user }) {
      return await this.ctx.bean.detail.read({ key, options, user });
    }

    async select({ atomKey, detailClass, options, user }) {
      return await this.ctx.bean.detail.select({ atomKey, detailClass, options, user });
    }

    async count({ atomKey, detailClass, options, user }) {
      return await this.ctx.bean.detail.count({ atomKey, detailClass, options, user });
    }

    async write({ key, item, options, user }) {
      return await this.ctx.bean.detail.write({ key, item, options, user });
    }

    async delete({ key, user }) {
      return await this.ctx.bean.detail.delete({ key, user });
    }

    async clone({ key, user }) {
      return await this.ctx.bean.detail.clone({ key, user });
    }

    async moveUp({ key, user }) {
      return await this.ctx.bean.detail.moveUp({ key, user });
    }

    async moveDown({ key, user }) {
      return await this.ctx.bean.detail.moveDown({ key, user });
    }

    async actions({ flowTaskId, atomKey, detailClass, mode, user }) {
      return await this.ctx.bean.detail.actions({ flowTaskId, atomKey, detailClass, mode, user });
    }

    async actionsBulk({ flowTaskId, atomKey, detailClass, mode, user }) {
      return await this.ctx.bean.detail.actionsBulk({ flowTaskId, atomKey, detailClass, mode, user });
    }

    async validator({ detailClass }) {
      return await this.ctx.bean.detail.validator({ detailClass });
    }
  }

  return Detail;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const base = __webpack_require__(589);
const detail = __webpack_require__(454);

module.exports = app => {
  const services = {
    base,
    detail,
  };
  return services;
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map