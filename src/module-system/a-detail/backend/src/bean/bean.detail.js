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
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const atomClassDetails = atomClassBase.details;
      if (!atomClassDetails) return; // do nothing
      // loop
      for (let atomClassDetail of atomClassDetails) {
        atomClassDetail = await ctx.bean.atomClass.get(atomClassDetail);
        const atomClassBaseDetail = await ctx.bean.atomClass.atomClass(atomClassDetail);
        await fn({ atomClassDetail, atomClassBaseDetail });
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
        fn: async ({ atomClassDetail, atomClassBaseDetail }) => {
          await this._copyDetails_Class({
            atomClassDetail,
            atomClassBaseDetail,
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

    async _copyDetails_Class({
      atomClassDetail,
      atomClassBaseDetail,
      atomClass,
      target,
      srcKeyAtom,
      destKeyAtom,
      destAtom,
      options,
      user,
    }) {
      // select all details src
      const detailsSrc = await ctx.bean.atom.select({
        atomClass: atomClassDetail,
        options: {
          atomIdMain: srcKeyAtom.atomId,
          mode: 'full',
        },
        pageForce: false,
      });
      // special for clone
      if (target === 'clone') {
        for (const detailSrc of detailsSrc) {
          const detailKey = await ctx.bean.atom.create({
            atomClass: atomClassDetail,
            item: null,
            options: { atomIdMain: destKeyAtom.atomId },
            user,
          });
          const fieldNameAtomIdMain = atomClassBaseDetail.detail.atomIdMain;
          const item = {
            ...detailSrc,
            atomId: detailKey.atomId,
            itemId: detailKey.itemId,
            [fieldNameAtomIdMain]: destKeyAtom.atomId,
          };
          await ctx.bean.atom.write({
            key: detailKey,
            atomClass: atomClassDetail,
            item,
            options: { ignoreValidate: true },
            user,
          });
        }
        return;
      }
      // select all details dest
      const detailsDest = await ctx.bean.atom.select({
        atomClass: atomClassDetail,
        options: {
          atomIdMain: destKeyAtom.atomId,
          mode: 'full',
        },
      });
      // detailKey

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
