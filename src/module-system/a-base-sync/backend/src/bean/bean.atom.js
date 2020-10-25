const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'atom');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get atomClass() {
      return ctx.bean.atomClass.module(this.moduleName);
    }

    get modelAtom() {
      return ctx.model.module(moduleInfo.relativeName).atom;
    }

    get modelAtomStar() {
      return ctx.model.module(moduleInfo.relativeName).atomStar;
    }

    get modelAtomLabel() {
      return ctx.model.module(moduleInfo.relativeName).atomLabel;
    }

    get modelAtomLabelRef() {
      return ctx.model.module(moduleInfo.relativeName).atomLabelRef;
    }
    get modelFile() {
      return ctx.model.module('a-file').file;
    }

    get sequence() {
      return ctx.bean.sequence.module(moduleInfo.relativeName);
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async getAtomClassId({ module, atomClassName, atomClassIdParent = 0 }) {
      const res = await this.atomClass.get({
        module,
        atomClassName,
        atomClassIdParent,
      });
      return res.id;
    }

    // atom and item

    // create
    async create({ atomClass, roleIdOwner, item, user }) {
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // item
      item = item || { };
      item.roleIdOwner = roleIdOwner;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const res = await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, item, user },
        fn: 'create',
      });
      const { atomId, itemId } = res;
      // save itemId
      await this._update({
        atom: { id: atomId, itemId },
        user,
      });
      // ok
      return { atomId, itemId };
    }

    // read
    async read({ key, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const item = await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, user },
        fn: 'read',
      });
      return item;
    }

    // count
    async count({ atomClass, options, user }) {
      return await this.select({ atomClass, options, user, count: 1 });
    }

    // select
    async select({ atomClass, options, user, pageForce = true, count = 0 }) {
      // atomClass
      let _atomClass;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // tableName
      let tableName = '';
      if (_atomClass) {
        tableName = this._getTableName({ atomClass: _atomClass, mode: options.mode });
        // 'where' should append atomClassId, such as article/post using the same table
        if (!options.where) options.where = {};
        options.where['a.atomClassId'] = atomClass.id;
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
      if (!count && atomClass) {
        const _moduleInfo = mparse.parseInfo(atomClass.module);
        const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
        await ctx.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, options, items, user },
          fn: 'select',
        });
      }
      // ok
      return items;
    }

    // write
    async write({ key, item, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // item draft
      const itemDraft = Object.assign({}, item, {
        atomId: key.atomId,
        itemId: key.itemId,
        atomStage: ctx.constant.module(moduleInfo.relativeName).atom.stage.draft,
      });
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, item: itemDraft, user },
        fn: 'write',
      });
    }

    // deleteBulk
    async deleteBulk({ keys, user }) {
      const resKeys = [];
      for (const key of keys) {
        const res = await this._deleteBulk_item({ key, user });
        if (res) {
          resKeys.push(key);
        }
      }
      return { keys: resKeys };
    }

    async _deleteBulk_item({ key, user }) {
      // check right
      const res = await ctx.bean.atom.checkRightAction({
        atom: { id: key.atomId }, action: 4, user,
      });
      if (!res) return false;
      // delete
      await this.delete({ key, user });
      // ok
      return true;
    }

    // delete
    async delete({ key, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // atom
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage === 0) {
        if (_atom.atomIdArchive) {
          // just close
          await this.modelAtom.update({
            id: key.atomId,
            atomClosed: 1,
          });
        } else {
          // delete
          await ctx.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key, user },
            fn: 'delete',
          });
        }
      } else if (_atom.atomStage === 1) {
        // delete history
        const listHistory = await this.modelAtom.select({
          where: {
            atomStage: 2,
            atomIdArchive: _atom.id,
          },
        });
        for (const item of listHistory) {
          await ctx.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: item.id, itemId: item.itemId }, user },
            fn: 'delete',
          });
        }
        // delete draft
        const itemDraft = await this.modelAtom.get({
          atomStage: 0,
          atomIdArchive: _atom.id,
        });
        if (itemDraft) {
          await ctx.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: itemDraft.id, itemId: itemDraft.itemId }, user },
            fn: 'delete',
          });
        }
        // delete archive
        await ctx.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, user },
          fn: 'delete',
        });
      } else if (_atom.atomStage === 2) {
        // delete history self
        await ctx.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, user },
          fn: 'delete',
        });
      }
    }

    async submit({ key, options, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      return await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, options, user },
        fn: 'submit',
      });
    }

    async _submitDirect({ /* key,*/ item, user }) {
      // archive -> history
      if (item.atomIdArchive) {
        await this._copy({
          target: 'history',
          srcKey: { atomId: item.atomIdArchive }, srcItem: null,
          destKey: null,
          user,
        });
      }
      // draft -> archive
      const keyArchive = await this._copy({
        target: 'archive',
        srcKey: { atomId: item.atomId }, srcItem: item,
        destKey: item.atomIdArchive ? { atomId: item.atomIdArchive } : null,
        user,
      });
      // update draft
      await this.modelAtom.update({
        id: item.atomId,
        atomClosed: 1,
        atomIdArchive: keyArchive.atomId,
      });
      // return keyArchive
      return { archive: { key: keyArchive } };
    }

    async openDraft({ key, user }) {
      const _atom = await this.modelAtom.get({ id: key.atomId });
      // draft
      if (_atom.atomStage === 0) {
        // do nothing
        return { draft: { key } };
      }
      // archive
      if (_atom.atomStage === 1) {
        if (_atom.atomIdDraft > 0) {
          // open
          await this.modelAtom.update({
            id: _atom.atomIdDraft,
            atomFlowId: 0,
            atomClosed: 0,
            userIdUpdated: user.id,
          });
          return { draft: { key: { atomId: _atom.atomIdDraft } } };
        }
        // ** create draft from archive
        const keyDraft = await this._copy({
          target: 'draft',
          srcKey: { atomId: key.atomId }, srcItem: null,
          destKey: null,
          user,
        });
        // ok
        return { draft: { key: keyDraft } };
      }
      // history
      if (_atom.atomStage === 2) {
        // ** create draft from history
        const keyDraft = await this._copy({
          target: 'draft',
          srcKey: { atomId: key.atomId }, srcItem: null,
          destKey: _atom.atomIdDraft ? { atomId: _atom.atomIdDraft } : null,
          user,
        });
        // ok
        return { draft: { key: keyDraft } };
      }
    }

    async clone({ key, user }) {
      const keyDraft = await this._copy({
        target: 'clone',
        srcKey: { atomId: key.atomId }, srcItem: null,
        destKey: null,
        user,
      });
      // ok
      return { draft: { key: keyDraft } };
    }

    // target: draft/archive/history/clone
    async _copy({ target, srcKey, srcItem, destKey, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: srcKey.atomId });
      if (!srcKey.itemId) srcKey.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // srcItem
      if (!srcItem) {
        srcItem = await ctx.bean.atom.read({ key: { atomId: srcKey.atomId }, user });
      }
      // destKey
      if (!destKey) {
        destKey = await this.create({ atomClass, roleIdOwner: srcItem.roleIdOwner, item: null, user });
      }
      if (!destKey.itemId) {
        const _item = await this.modelAtom.get({ id: destKey.atomId });
        destKey.itemId = _item.itemId;
      }
      // atomStage
      const atomStage = ctx.constant.module(moduleInfo.relativeName).atom.stage[target] || 0;
      // atomClosed
      const atomClosed = 0;
      // atomIdDraft/atomIdArchive
      let atomIdDraft;
      let atomIdArchive;
      let userIdUpdated = srcItem.userIdUpdated;
      let userIdCreated = srcItem.userIdCreated || userIdUpdated;
      let atomFlowId = srcItem.atomFlowId;
      let atomName = srcItem.atomName;
      if (target === 'draft') {
        atomIdDraft = 0;
        atomIdArchive = srcItem.atomStage === 1 ? srcItem.atomId : srcItem.atomIdArchive;
        userIdUpdated = user.id;
        atomFlowId = 0;
      } else if (target === 'archive') {
        atomIdDraft = srcItem.atomId;
        atomIdArchive = 0;
      } else if (target === 'history') {
        atomIdDraft = srcItem.atomIdDraft;
        atomIdArchive = srcItem.atomId;
      } else if (target === 'clone') {
        atomIdDraft = 0;
        atomIdArchive = 0;
        userIdUpdated = user.id;
        userIdCreated = user.id;
        atomFlowId = 0;
        atomName = `${srcItem.atomName}-${ctx.text('CloneCopyText')}`;
      }
      // destItem
      const destItem = Object.assign({}, srcItem, {
        atomId: destKey.atomId,
        itemId: destKey.itemId,
        userIdCreated,
        userIdUpdated,
        atomName,
        atomStage,
        atomFlowId,
        allowComment: srcItem.allowComment,
        attachmentCount: srcItem.attachmentCount,
        atomClosed,
        atomIdDraft,
        atomIdArchive,
      });
      // update fields
      await this.modelAtom.update({
        id: destItem.atomId,
        userIdCreated: destItem.userIdCreated,
        userIdUpdated: destItem.userIdUpdated,
        atomName: destItem.atomName,
        atomStage: destItem.atomStage,
        atomFlowId: destItem.atomFlowId,
        allowComment: destItem.allowComment,
        attachmentCount: destItem.attachmentCount,
        atomClosed: destItem.atomClosed,
        atomIdDraft: destItem.atomIdDraft,
        atomIdArchive: destItem.atomIdArchive,
      });
      // copy attachments
      await this._copyAttachments({ atomIdSrc: srcKey.atomId, atomIdDest: destKey.atomId });
      // bean write
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key: destKey, item: destItem, user },
        fn: 'write',
      });
      // bean copy
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, target, srcKey, srcItem, destKey, destItem, user },
        fn: 'copy',
      });
      // ok
      return destKey;
    }

    async _copyAttachments({ atomIdSrc, atomIdDest }) {
      const files = await this.modelFile.select({
        where: { atomId: atomIdSrc },
      });
      for (const file of files) {
        delete file.id;
        file.atomId = atomIdDest;
        await this.modelFile.insert(file);
      }
    }

    async exportBulk({ atomClass, options, fields, user }) {
      // atomClass
      let _atomClass;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // select
      const items = await this.select({ atomClass, options, user, pageForce: false });
      // export
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const res = await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, fields, items, user },
        fn: 'exportBulk',
      });
      console.log(res);


    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flow({ key, atom: { atomFlowId } }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomFlowId,
      });
    }

    async star({ key, atom: { star = 1 }, user }) {
      // get
      const atom = await this.get({ atomId: key.atomId });
      if (atom.atomStage !== 1) ctx.throw.module(moduleInfo.relativeName, 1010);
      // check if exists
      let diff = 0;
      const _star = await this.modelAtomStar.get({
        userId: user.id,
        atomId: key.atomId,
      });
      if (_star && !star) {
        diff = -1;
        // delete
        await this.modelAtomStar.delete({
          id: _star.id,
        });
      } else if (!_star && star) {
        diff = 1;
        // new
        await this.modelAtomStar.insert({
          userId: user.id,
          atomId: key.atomId,
          star: 1,
        });
      }
      // starCount
      let starCount = atom.starCount;
      if (diff !== 0) {
        starCount += diff;
        await this.modelAtom.update({
          id: key.atomId,
          starCount,
        });
      }
      // ok
      return { star, starCount };
    }

    async readCount({ key, atom: { readCount = 1 }, user }) {
      await this.modelAtom.query('update aAtom set readCount = readCount + ? where iid=? and id=?',
        [ readCount, ctx.instance.id, key.atomId ]);
    }

    async comment({ key, atom: { comment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set commentCount = commentCount + ? where iid=? and id=?',
        [ comment, ctx.instance.id, key.atomId ]);
    }

    async attachment({ key, atom: { attachment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set attachmentCount = attachmentCount + ? where iid=? and id=?',
        [ attachment, ctx.instance.id, key.atomId ]);
    }

    async labels({ key, atom: { labels = null }, user }) {
      // get
      const atom = await this.get({ atomId: key.atomId });
      if (atom.atomStage !== 1) ctx.throw.module(moduleInfo.relativeName, 1010);
      // force delete
      await this.modelAtomLabel.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      await this.modelAtomLabelRef.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      // new
      if (labels && labels.length > 0) {
        await this.modelAtomLabel.insert({
          userId: user.id,
          atomId: key.atomId,
          labels: JSON.stringify(labels),
        });
        for (const labelId of labels) {
          await this.modelAtomLabelRef.insert({
            userId: user.id,
            atomId: key.atomId,
            labelId,
          });
        }
      }
    }

    async schema({ atomClass, schema, user }) {
      const validator = await this.validator({ atomClass, user });
      if (!validator) return null;
      const _schema = ctx.bean.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
      return {
        module: validator.module,
        validator: validator.validator,
        schema: _schema,
      };
    }

    async validator({ atomClass: { id }, user }) {
      let atomClass = await this.atomClass.get({ id });
      atomClass = await this.atomClass.top(atomClass);
      return await this.atomClass.validator({ atomClass, user });
    }

    // atom

    async _add({
      atomClass: { id, atomClassName, atomClassIdParent = 0 },
      atom: { itemId, atomName, roleIdOwner = 0 },
      user,
    }) {
      let atomClassId = id;
      if (!atomClassId) atomClassId = await this.getAtomClassId({ atomClassName, atomClassIdParent });
      const res = await this.modelAtom.insert({
        atomStage: 0,
        itemId,
        atomClassId,
        atomName,
        userIdCreated: user.id,
        userIdUpdated: user.id,
        roleIdOwner,
      });
      return res.insertId;
    }

    async _update({
      atom: { id, atomName, allowComment, itemId },
      /* user,*/
    }) {
      const params = { id };
      if (atomName !== undefined) params.atomName = atomName;
      if (allowComment !== undefined) params.allowComment = allowComment;
      if (itemId !== undefined) params.itemId = itemId;
      await this.modelAtom.update(params);
    }

    async _delete({
      atom,
      /* user,*/
    }) {
      // aAtom
      await this.modelAtom.delete(atom);
      // aFile
      await this.modelFile.delete({ atomId: atom.id });
    }

    async _get({ atomClass, key, mode, user }) {
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const tableName = this._getTableName({ atomClass: _atomClass, mode });
      const sql = this.sqlProcedure.getAtom({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, atomId: key.atomId,
      });
      return await ctx.model.queryOne(sql);
    }

    async _list({ tableName, options: { where, orders, page, star = 0, label = 0, comment = 0, file = 0, stage = 'archive' }, user, pageForce = true, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);
      stage = typeof stage === 'number' ? stage : ctx.constant.module(moduleInfo.relativeName).atom.stage[stage];
      const sql = this.sqlProcedure.selectAtoms({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, where, orders, page,
        star, label, comment, file, count,
        stage,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    // right

    async checkRoleRightRead({ atom: { id }, roleId }) {
      // not check draft
      // archive/history
      const sql = this.sqlProcedure.checkRoleRightRead({
        iid: ctx.instance.id,
        roleIdWho: roleId,
        atomId: id,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightRead({ atom: { id }, user }) {
      // draft: only userIdUpdated
      const _atom = await this.modelAtom.get({ id });
      if (_atom.atomStage === 0) {
        // 1. closed
        if (_atom.atomClosed) return null;
        // 2. self
        if (_atom.userIdUpdated === user.id) return _atom;
        // 3. todo: flow task
        // others
        return null;
      }
      // archive/history
      const sql = this.sqlProcedure.checkRightRead({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightAction({ atom: { id }, action, stage, user }) {
      const _atom = await this.modelAtom.get({ id });
      if ((stage === 'draft' && _atom.atomStage > 0) || ((stage === 'archive' || stage === 'history') && _atom.atomStage === 0)) return null;
      // action.stage
      const atomClass = await ctx.bean.atomClass.get({ id: _atom.atomClassId });
      const actionBase = ctx.bean.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code: action });
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => ctx.constant.module(moduleInfo.relativeName).atom.stage[item] === _atom.atomStage)) return null;
      }
      // draft
      if (_atom.atomStage === 0) {
        // 1. closed
        if (_atom.atomClosed) return null;
        // 2. flow
        if (_atom.atomFlowId > 0) return null;
        // 3. self
        if (_atom.userIdUpdated === user.id) return _atom;
        // others
        return null;
      }
      // draft: must closed
      let _atomDraft;
      if (_atom.atomIdDraft) {
        _atomDraft = await this.modelAtom.get({ id: _atom.atomIdDraft });
      }
      if (_atomDraft && !_atomDraft.atomClosed) return null;
      // check archive/history
      const sql = this.sqlProcedure.checkRightAction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
        action,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightActionBulk({
      atomClass: { id, module, atomClassName, atomClassIdParent = 0 },
      action,
      user,
    }) {
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const sql = this.sqlProcedure.checkRightActionBulk({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClassId: id,
        action,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightCreate({ atomClass, user }) {
      return await this.checkRightActionBulk({ atomClass, action: 1, user });
    }

    async checkRightCreateRole({
      atomClass: { id, module, atomClassName, atomClassIdParent = 0 },
      roleIdOwner,
      user,
    }) {
      if (!roleIdOwner) return null;
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const sql = this.sqlProcedure.checkRightCreateRole({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClassId: id,
        roleIdOwner,
      });
      return await ctx.model.queryOne(sql);
    }

    // actions of atom
    async actions({ key, basic, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      // actions
      const _basic = basic ? 'and a.code in (3,4)' : '';
      const sql = `
        select a.*,b.module,b.atomClassName,b.atomClassIdParent from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.bulk=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      const actions = await ctx.model.query(sql, [ ctx.instance.id, atomClass.id ]);
      // actions res
      const actionsRes = [];
      for (const action of actions) {
        const res = await this.checkRightAction({ atom: { id: key.atomId }, action: action.code, user });
        if (res) actionsRes.push(action);
      }
      return actionsRes;
    }

    // actionsBulk of atomClass
    async actionsBulk({ atomClass: { id, module, atomClassName, atomClassIdParent = 0 }, user }) {
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const sql = this.sqlProcedure.checkRightActionBulk({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClassId: id,
      });
      return await ctx.model.query(sql);
    }

    // preffered roles
    async preferredRoles({ atomClass, user }) {
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);

      const roles = await ctx.model.query(
        `select a.*,b.userId,c.roleName as roleNameWho from aViewRoleRightAtomClass a
          inner join aUserRole b on a.roleIdWho=b.roleId
          left join aRole c on a.roleIdWho=c.id
          where a.iid=? and a.atomClassId=? and a.action=1 and b.userId=?
          order by a.roleIdWho desc`,
        [ ctx.instance.id, atomClass.id, user.id ]);
      return roles;
    }

    _getTableName({ atomClass, mode }) {
      const tableNameModes = atomClass.tableNameModes || {};
      if (mode === 'search') {
        return tableNameModes.search || tableNameModes.full || tableNameModes.default || atomClass.tableName;
      }
      return tableNameModes[mode] || tableNameModes.default || atomClass.tableName;
    }

  }

  return Atom;
};
