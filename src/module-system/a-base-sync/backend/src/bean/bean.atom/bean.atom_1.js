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

    async _submitDirect({ key, item, options, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // formal -> history
      if (item.atomIdFormal) {
        if (_atomClass.history !== false) {
          await this._copy({
            target: 'history',
            srcKey: { atomId: item.atomIdFormal },
            srcItem: null,
            destKey: null,
            options,
            user,
          });
        }
      }
      // draft -> formal
      const keyFormal = await this._copy({
        target: 'formal',
        srcKey: { atomId: item.atomId },
        srcItem: item,
        destKey: item.atomIdFormal ? { atomId: item.atomIdFormal } : null,
        options,
        user,
      });
      // update draft
      await this.modelAtom.update({
        id: item.atomId,
        atomClosed: 1,
        atomIdFormal: keyFormal.atomId,
      });
      // notify
      this._notifyDraftsDrafting(user, atomClass);
      if (item.atomFlowId > 0) {
        this._notifyDraftsFlowing(user, atomClass);
      }
      // get formal atom
      const atomFormal = await this.modelAtom.get({ id: keyFormal.atomId });
      atomFormal.atomId = atomFormal.id;
      atomFormal.module = atomClass.module;
      atomFormal.atomClassName = atomClass.atomClassName;
      // return keyFormal
      return { formal: { key: keyFormal, atom: atomFormal } };
    }

    async _switchToSimple({ atomClass, _atomClass, atom, user }) {
      let atomIdDraft;
      let atomIdFormal;
      if (atom.atomStage === 0) {
        // is draft
        atomIdDraft = atom.id;
        atomIdFormal = atom.atomIdFormal;
        if (!atomIdFormal) {
          // formal/history not exists, so copy it
          // create formal
          const srcItem = await ctx.bean.atom.read({ key: { atomId: atomIdDraft }, user });
          srcItem.atomSimple = 1; // important
          const keyFormal = await this._copy({
            target: 'formal',
            srcKey: { atomId: atomIdDraft },
            srcItem,
            destKey: null,
            options: null,
            user,
          });
          atomIdFormal = keyFormal.atomId;
        }
      } else {
        // is formal/history
        atomIdDraft = atom.atomIdDraft;
        atomIdFormal = atom.atomStage === 1 ? atom.id : atom.atomIdFormal;
      }
      // update history
      await ctx.model.query(
        `
          update aAtom set atomSimple=1, atomIdDraft=0 
            where iid=? and deleted=0 and atomStage=2 and atomIdFormal=?
        `,
        [ctx.instance.id, atomIdFormal]
      );
      // update formal
      await this.modelAtom.update({
        id: atomIdFormal,
        atomSimple: 1,
        atomIdDraft: 0,
      });
      // delete draft
      if (atomIdDraft) {
        const atomDraft = atom.atomStage === 0 ? atom : await this.modelAtom.get({ id: atomIdDraft });
        const keyDraft = { atomId: atomDraft.id, itemId: atomDraft.itemId };
        const _moduleInfo = mparse.parseInfo(atomClass.module);
        const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: keyDraft, user },
          fn: 'delete',
        });
        // notify to change draft stats
        this._notifyDraftsDrafting(null, atomClass);
      }
      // ok
      if (atom.atomStage === 0) {
        // fetch formal
        return await this.modelAtom.get({ id: atomIdFormal });
      }
      atom.atomSimple = 1;
      return atom;
    }

    async _switchToSimpleZero({ /* atomClass, _atomClass,*/ atom, user }) {
      const atomIdFormal = atom.atomStage === 1 ? atom.id : atom.atomIdFormal;
      // update history's atomSimple
      await ctx.model.query(
        `
          update aAtom set atomSimple=0
            where iid=? and deleted=0 and atomStage=2 and atomIdFormal=?
        `,
        [ctx.instance.id, atomIdFormal]
      );
      // update formal's atomSimple
      await this.modelAtom.update({
        id: atomIdFormal,
        atomSimple: 0,
      });
      // ** create draft from formal
      const keyDraft = await this._createDraftFromFormal({ atomIdFormal, user });
      // update draft's atomClosed
      await this.modelAtom.update({
        id: keyDraft.atomId,
        atomClosed: 1,
      });
      // ok
      atom.atomSimple = 0;
      return atom;
    }

    async _checkSimpleSwitch({ atomClass, _atomClass, atom, user }) {
      // the same mode
      if (Boolean(atom.atomSimple) === Boolean(_atomClass.simple)) return atom;
      // -> simple
      if (_atomClass.simple) {
        return await this._switchToSimple({ atomClass, _atomClass, atom, user });
      }
      // -> not simple
      return await this._switchToSimpleZero({ atomClass, _atomClass, atom, user });
    }

    async _createDraftFromFormal({ atomIdFormal, user }) {
      // ** create draft from formal
      const keyDraft = await this._copy({
        target: 'draft',
        srcKey: { atomId: atomIdFormal },
        srcItem: null,
        destKey: null,
        user,
      });
      // update history
      await ctx.model.query(
        `
          update aAtom set atomIdDraft=?
            where iid=? and deleted=0 and atomStage=2 and atomIdFormal=?
        `,
        [keyDraft.atomId, ctx.instance.id, atomIdFormal]
      );
      // update formal
      await this.modelAtom.update({
        id: atomIdFormal,
        atomIdDraft: keyDraft.atomId,
      });
      // ok
      return keyDraft;
    }

    async _openDraft_asSimple({ atom, user }) {
      let keyFormal;
      let changed = true;
      // formal
      if (atom.atomStage === 1) {
        keyFormal = { atomId: atom.id, itemId: atom.itemId };
        changed = false;
      }
      // history
      if (atom.atomStage === 2) {
        const atomIdFormal = atom.atomIdFormal;
        keyFormal = { atomId: atomIdFormal };
        // ** create formal from history
        keyFormal = await this._copy({
          target: 'formal',
          srcKey: { atomId: atom.id },
          srcItem: null,
          destKey: keyFormal,
          user,
        });
        // update formal
        await this.modelAtom.update({
          id: atomIdFormal,
          userIdUpdated: user.id,
        });
      }
      // ok
      return { formal: { key: keyFormal }, changed };
    }

    async _openDraft_asSimpleZero({ /* atomClass, _atomClass,*/ atom, user }) {
      let keyDraft;
      let changed = true;
      // draft
      if (atom.atomStage === 0) {
        keyDraft = { atomId: atom.id, itemId: atom.itemId };
        if (atom.atomClosed === 1) {
          // open
          await this._openDraft_update({
            atomId: atom.id,
            atomRevision: atom.atomRevision + 1,
            user,
          });
        } else {
          changed = false;
        }
      }
      // formal
      if (atom.atomStage === 1) {
        if (atom.atomIdDraft > 0) {
          keyDraft = { atomId: atom.atomIdDraft };
        } else {
          // ** create draft from formal
          keyDraft = await this._createDraftFromFormal({ atomIdFormal: atom.id, user });
        }
        // open
        await this._openDraft_update({
          atomId: keyDraft.atomId,
          atomRevision: atom.atomRevision + 1,
          user,
        });
      }
      // history
      if (atom.atomStage === 2) {
        if (atom.atomIdDraft > 0) {
          keyDraft = { atomId: atom.atomIdDraft };
        } else {
          // ** create draft from formal
          keyDraft = await this._createDraftFromFormal({ atomIdFormal: atom.atomIdFormal, user });
        }
        // hold atomRevision
        const atomDraft = await this.modelAtom.get({ id: keyDraft.atomId });
        const atomRevision = atomDraft.atomRevision;
        // ** create draft from history
        keyDraft = await this._copy({
          target: 'draft',
          srcKey: { atomId: atom.id },
          srcItem: null,
          destKey: keyDraft,
          user,
        });
        // open
        await this._openDraft_update({
          atomId: keyDraft.atomId,
          atomRevision: atomRevision + 1,
          user,
        });
      }
      // ok
      return { draft: { key: keyDraft }, changed };
    }

    async _openDraft_update({ atomId, atomRevision, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
      await this.modelAtom.update({
        id: atomId,
        atomFlowId: 0,
        atomClosed: 0,
        atomRevision,
        userIdUpdated: user.id,
      });
      // notify
      this._notifyDraftsDrafting(null, atomClass);
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
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // tableName
      const tableName = await this.getTableName({
        atomClass,
        atomClassBase: _atomClass,
        options,
        mode,
        user,
        action: 'read',
        key,
      });
      // cms
      const cms = _atomClass && _atomClass.cms;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // sql
      const sql = this.sqlProcedure.getAtom({
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

    // useAreaScope
    _checkUseAreaScope(atomClass) {
      if (!ctx.bean.areaScope.areaScopeEnabled()) return false;
      if (!atomClass) return true;
      const areaScopeMeta = ctx.bean.areaScope.getAreaScopeMeta({ atomClass, escape: false });
      return !!areaScopeMeta;
    }

    async _list({
      tableName,
      options: {
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
      },
      cms,
      forAtomUser,
      useAreaScope,
      user,
      pageForce = true,
      count = 0,
    }) {
      page = ctx.bean.util.page(page, pageForce);
      stage = typeof stage === 'number' ? stage : ctx.constant.module(moduleInfo.relativeName).atom.stage[stage];
      const sql = this.sqlProcedure.selectAtoms({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
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
        useAreaScope,
        role,
      });
      debug('===== selectAtoms =====\n%s', sql);
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    // right

    async _checkRightAction({ atom, action, stage, user, checkFlow }) {
      const _atom = atom;
      if (!_atom) ctx.throw.module(moduleInfo.relativeName, 1002);
      // adjust for simple
      if (stage === 'draft' && _atom.atomSimple === 1) stage = 'formal';
      if (
        (stage === 'draft' && _atom.atomStage > 0) ||
        ((stage === 'formal' || stage === 'history') && _atom.atomStage === 0)
      ) {
        return null;
      }
      // action.stage
      const atomClass = await ctx.bean.atomClass.get({ id: _atom.atomClassId });
      const actionBase = ctx.bean.base.action({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        code: action,
      });
      // if (!actionBase) throw new Error(`action not found: ${atomClass.module}:${atomClass.atomClassName}:${action}`);
      if (!actionBase) {
        await ctx.bean.atomAction.model.delete({ atomClassId: atomClass.id, code: action });
        return null;
      }
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => ctx.constant.module(moduleInfo.relativeName).atom.stage[item] === _atom.atomStage)) {
          return null;
        }
      }
      // actionBase.enableOnStatic
      if (_atom.atomStatic === 1 && !actionBase.enableOnStatic) {
        return null;
      }
      // draft
      if (_atom.atomStage === 0) {
        // self
        const bSelf = _atom.userIdUpdated === user.id;
        // checkFlow
        if (_atom.atomFlowId > 0 && checkFlow) {
          const flow = await ctx.bean.flow.get({ flowId: _atom.atomFlowId, history: true, user });
          if (!flow) return null;
          return _atom;
        }
        // 1. closed
        if (_atom.atomClosed) {
          // enable on 'self and write', not including 'delete'
          if (bSelf && action === 3) {
            // return _atom;
            if (_atom.atomIdFormal) {
              const _atomFormal = await this.modelAtom.get({ id: _atom.atomIdFormal });
              return await this._checkRightAction({ atom: _atomFormal, action, stage: 'formal', user, checkFlow });
            }
          }
          return null;
        }
        // 2. flow
        if (_atom.atomFlowId > 0) return null;
        // 3. self
        if (bSelf) return _atom;
        // others
        return null;
      }
      // draft: must closed
      let _atomDraft;
      if (_atom.atomIdDraft) {
        _atomDraft = await this.modelAtom.get({ id: _atom.atomIdDraft });
      }
      // check draft for ( action 3 + atomStage 1)
      //   not handle for history
      if (
        action === 3 &&
        _atom.atomStage === 1 &&
        _atomDraft &&
        !_atomDraft.atomClosed &&
        _atomDraft.userIdUpdated === user.id
      ) {
        return await this._checkRightAction({ atom: _atomDraft, action, stage: 'draft', user, checkFlow });
      }
      // check enableOnOpened
      if (_atomDraft && !_atomDraft.atomClosed && !actionBase.enableOnOpened) return null;
      // enable/disable
      if (action === 6 && _atom.atomDisabled === 0) return null;
      if (action === 7 && _atom.atomDisabled === 1) return null;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // check formal/history
      const sql = this.sqlProcedure.checkRightAction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: atom.id,
        action,
        forAtomUser,
      });
      return await ctx.model.queryOne(sql);
    }

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
        await ctx.bean.atomAction.model.delete({ atomClassId: actionRes.atomClassId, code: actionRes.code });
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
