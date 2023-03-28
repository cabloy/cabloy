const require3 = require('require3');
const debug = require3('debug')('sql');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _deleteBulk_item({ key, user }) {
      // check right
      const res = await ctx.bean.atom.checkRightAction({
        atom: { id: key.atomId },
        action: 4,
        user,
      });
      if (!res) return false;
      // delete
      await this.delete({ key, user });
      // ok
      return true;
    }

    _copy_prepareDestItem({ target, srcItem, user }) {
      // atomSimple
      const atomSimple = srcItem.atomSimple;
      // atomStage
      let atomStage = ctx.constant.module(moduleInfo.relativeName).atom.stage[target];
      if (atomStage === undefined) {
        atomStage = atomSimple; // support simple when target='clone'
      }
      // if (target === 'clone') {
      //   atomStage = atomSimple; // support simple
      // }
      // atomClosed
      const atomClosed = 0;
      // atomIdDraft/atomIdFormal
      let atomIdDraft;
      let atomIdFormal;
      let userIdUpdated = srcItem.userIdUpdated;
      let userIdCreated = srcItem.userIdCreated || userIdUpdated;
      let atomFlowId = srcItem.atomFlowId;
      let atomName = srcItem.atomName;
      let atomStatic = srcItem.atomStatic;
      let atomStaticKey = srcItem.atomStaticKey;
      let atomRevision = srcItem.atomRevision;
      const atomLanguage = srcItem.atomLanguage;
      const atomCategoryId = srcItem.atomCategoryId;
      const atomTags = srcItem.atomTags;
      if (target === 'draft') {
        atomIdDraft = 0;
        atomIdFormal = srcItem.atomStage === 1 ? srcItem.atomId : srcItem.atomIdFormal;
        userIdUpdated = user.id;
        atomFlowId = 0; // will start a new flow instance
        // formal->draft: = srcItem.atomRevision
        if (srcItem.atomStage === 2) {
          // history->draft
          atomRevision = undefined;
        }
      } else if (target === 'formal') {
        if (srcItem.atomStage === 0) {
          // draft->formal
          atomIdDraft = srcItem.atomId;
        } else {
          // history->formal
          atomIdDraft = 0;
        }
        atomIdFormal = 0;
        // history->formal
        if (srcItem.atomStage === 2) {
          atomRevision = undefined;
        }
      } else if (target === 'history') {
        // formal->history
        atomIdDraft = srcItem.atomIdDraft;
        atomIdFormal = srcItem.atomId;
      } else if (target === 'clone') {
        atomIdDraft = 0;
        atomIdFormal = 0;
        userIdUpdated = user.id;
        userIdCreated = user.id;
        atomFlowId = 0;
        atomName = `${srcItem.atomName}-${ctx.text('CloneCopyText')}`;
        atomStatic = 0;
        if (atomStaticKey) {
          atomStaticKey = ctx.bean.util.uuidv4();
        }
        atomRevision = 0;
      }
      // destItem
      const destItem = Object.assign({}, srcItem, {
        // atomId: destKey.atomId,
        // itemId: destKey.itemId,
        userIdCreated,
        userIdUpdated,
        atomName,
        atomStatic,
        atomStaticKey,
        atomRevision,
        atomLanguage,
        atomCategoryId,
        atomTags,
        atomSimple,
        atomStage,
        atomFlowId,
        allowComment: srcItem.allowComment,
        attachmentCount: srcItem.attachmentCount,
        atomClosed,
        atomIdDraft,
        atomIdFormal,
        createdAt: srcItem.atomCreatedAt,
        updatedAt: srcItem.atomUpdatedAt,
      });
      return destItem;
    }

    // target: draft/formal/history/clone
    async _copy({ target, srcKey, srcItem, destKey, options, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: srcKey.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!srcKey.itemId) srcKey.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // srcItem
      if (!srcItem) {
        srcItem = await ctx.bean.atom.read({ key: { atomId: srcKey.atomId }, user: null });
      }
      // destItem
      const destItem = this._copy_prepareDestItem({ target, srcItem, user });
      // destKey
      if (!destKey) {
        destKey = await this.create({
          atomClass,
          atomStage: destItem.atomStage,
          roleIdOwner: srcItem.roleIdOwner,
          item: null,
          createOptions: { target, srcItem, destItem },
          user,
        });
      }
      if (!destKey.itemId) {
        const _item = await this.modelAtom.get({ id: destKey.atomId });
        destKey.itemId = _item.itemId;
      }
      // append destKey
      destItem.atomId = destKey.atomId;
      destItem.itemId = destKey.itemId;
      // update fields
      const data = {
        id: destItem.atomId,
        userIdCreated: destItem.userIdCreated,
        userIdUpdated: destItem.userIdUpdated,
        //   see also: atomBase
        // atomName: destItem.atomName,
        // atomLanguage: destItem.atomLanguage,
        // atomCategoryId: destItem.atomCategoryId,
        // atomTags: destItem.atomTags,
        // allowComment: destItem.allowComment,
        atomStatic: destItem.atomStatic,
        atomStaticKey: destItem.atomStaticKey,
        atomRevision: destItem.atomRevision,
        atomSimple: destItem.atomSimple,
        atomStage: destItem.atomStage,
        // atomFlowId: destItem.atomFlowId,
        attachmentCount: destItem.attachmentCount,
        // atomClosed: destItem.atomClosed,
        atomIdDraft: destItem.atomIdDraft,
        atomIdFormal: destItem.atomIdFormal,
        createdAt: destItem.createdAt,
        updatedAt: destItem.updatedAt,
      };
      if (target === 'draft' || target === 'clone') {
        data.atomClosed = destItem.atomClosed;
        data.atomFlowId = destItem.atomFlowId;
      }
      await this.modelAtom.update(data);
      // bean write
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, target, key: destKey, item: destItem, options, user },
        fn: 'write',
      });
      // bean copy
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, target, srcKey, srcItem, destKey, destItem, options, user },
        fn: 'copy',
      });
      // copy attachments
      await this._copyAttachments({ atomIdSrc: srcKey.atomId, atomIdDest: destKey.atomId });
      // copy details
      await ctx.bean.detail._copyDetails({
        atomClass,
        target,
        srcKeyAtom: srcKey,
        destKeyAtom: destKey,
        destAtom: destItem,
        options,
        user,
      });
      // ok
      return destKey;
    }

    async _copyAttachments({ atomIdSrc, atomIdDest }) {
      // delete old files
      await this.modelFile.delete({ atomId: atomIdDest, mode: 2 });
      // add new files
      const files = await this.modelFile.select({
        where: { atomId: atomIdSrc, mode: 2 },
      });
      for (const file of files) {
        delete file.id;
        file.atomId = atomIdDest;
        await this.modelFile.insert(file);
      }
    }

    // atom

    async _add({
      atomClass,
      atom: {
        atomStage = 0,
        itemId,
        atomName,
        roleIdOwner = 0,
        atomStatic = 0,
        atomStaticKey = null,
        atomRevision = 0,
        atomLanguage = null,
        atomCategoryId = 0,
        atomTags = null,
        allowComment = 1,
        atomSimple = 0,
      },
      user,
    }) {
      const atomClassId = atomClass.id;
      const res = await this.modelAtom.insert({
        atomStage,
        itemId,
        atomClassId,
        atomName,
        atomStatic,
        atomStaticKey,
        atomRevision,
        atomLanguage,
        atomCategoryId,
        atomTags,
        atomSimple,
        allowComment,
        userIdCreated: user.id,
        userIdUpdated: user.id,
        roleIdOwner,
      });
      return res.insertId;
    }

    async _update({ atom /* , user,*/ }) {
      await this.modelAtom.update(atom);
    }

    async _delete({ atomClass, atom, user }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: atom.id });
      }
      // stars
      await this._delete_stars({ atomId: atom.id });
      // labels
      await this._delete_labels({ atomId: atom.id });
      // aFile
      await this.modelFile.delete({ atomId: atom.id });
      // details
      await ctx.bean.detail._deleteDetails({ atomClass, atomKey: { atomId: atom.id }, user });
      // aAtom
      await this.modelAtom.delete(atom);
    }

    async _delete_stars({ atomId }) {
      const items = await this.modelAtomStar.select({
        where: { atomId, star: 1 },
      });
      for (const item of items) {
        this._notifyStars({ id: item.userId });
      }
      if (items.length > 0) {
        await this.modelAtomStar.delete({ atomId });
      }
    }

    async _delete_labels({ atomId }) {
      const items = await this.modelAtomLabel.select({
        where: { atomId },
      });
      for (const item of items) {
        this._notifyLabels({ id: item.userId });
      }
      if (items.length > 0) {
        await this.modelAtomLabel.delete({ atomId });
        await this.modelAtomLabelRef.delete({ atomId });
      }
    }

    async _get({ atomClass, options, key, mode, user }) {
      if (!options) options = {};
      const resource = options.resource || 0;
      const resourceLocale = options.resourceLocale === false ? false : options.resourceLocale || ctx.locale;
      // atomClass
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // tableName
      const tableName = await this.getTableName({
        atomClass,
        atomClassBase,
        options,
        mode,
        user,
        action: 'read',
        key,
      });
      // cms
      const cms = atomClassBase && atomClassBase.cms;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // sql
      const sql = await this.sqlProcedure.getAtom({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName,
        atomId: key.atomId,
        resource,
        resourceLocale,
        mode,
        cms,
        forAtomUser,
      });
      debug('===== getAtom =====\n%s', sql);
      // query
      return await ctx.model.queryOne(sql);
    }

    // forAtomUser
    _checkForAtomUser(atomClass) {
      return atomClass && atomClass.module === 'a-base' && atomClass.atomClassName === 'user';
    }

    async _list({ atomClass, options, user, pageForce = true, count = 0 }) {
      let {
        where,
        orders,
        page,
        star = 0,
        label = 0,
        comment = 0,
        file = 0,
        stage = 'formal',
        language,
        category = 0,
        tag = 0,
        mine = 0,
        resource = 0,
        resourceLocale,
        role = 0,
        mode,
      } = options;
      // page
      page = ctx.bean.util.page(page, pageForce);
      // stage
      stage = typeof stage === 'number' ? stage : ctx.constant.module(moduleInfo.relativeName).atom.stage[stage];
      // tableName
      let atomClassBase;
      let tableName = '';
      if (atomClass) {
        atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
        tableName = await this.getTableName({
          atomClass,
          atomClassBase,
          options,
          mode: options.mode,
          user,
          action: 'select',
          count,
        });
        // 'where' should append atomClassId, such as article/post using the same table
        options.where['a.atomClassId'] = atomClass.id;
      }
      // cms
      const cms = atomClassBase && atomClassBase.cms;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // select
      const sql = await this.sqlProcedure.selectAtoms({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        atomClass,
        tableName,
        where,
        orders,
        page,
        star,
        label,
        comment,
        file,
        count,
        stage,
        language,
        category,
        tag,
        mine,
        resource,
        resourceLocale,
        mode,
        cms,
        forAtomUser,
        role,
      });
      debug('===== selectAtoms =====\n%s', sql);
      const items = sql === false ? [] : await ctx.model.query(sql);
      // count
      if (count) {
        return items[0]._count;
      }
      // ok
      return items;
    }

    // right

    async __checkRightActionBulk({ actionRes, stage /* user*/ }) {
      // not care about stage
      if (!stage) return actionRes;
      // action base
      const actionBase = ctx.bean.base.action({
        module: actionRes.module,
        atomClassName: actionRes.atomClassName,
        code: actionRes.code,
      });
      if (!actionBase) {
        if (actionRes.code < 10000) {
          await ctx.bean.atomAction.delete({ atomClassId: actionRes.atomClassId, code: actionRes.code });
        }
        return null;
      }
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => item === stage)) return null;
      }
      return actionRes;
    }

    _notifyDraftsDrafting(user, atomClass) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'draftsDrafting',
        nameSub: `${atomClass.module}_${atomClass.atomClassName}`,
        user,
      });
    }

    _notifyDraftsFlowing(user, atomClass) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'draftsFlowing',
        nameSub: `${atomClass.module}_${atomClass.atomClassName}`,
        user,
      });
    }

    _notifyStars(user) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'stars',
        user,
      });
    }

    _notifyLabels(user) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'labels',
        user,
      });
    }
  }

  return Atom;
};
