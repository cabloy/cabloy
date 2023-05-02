const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async clone({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter, user }) {
      // atomClass
      const { key, atomClass, atomClassBase, options } = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      // copy
      const keyDraft = await this._copy({
        target: 'clone',
        atomClass,
        srcKey: { atomId: key.atomId },
        srcItem: null,
        destKey: null,
        options,
        user,
      });
      // ok
      // get atom
      const atom = await this.read({ key: keyDraft, atomClass, options, user });
      // draft/formal
      const res = { key: keyDraft, atom };
      if (!atomClassBase.itemOnly && atom.atomStage === 0) return { draft: res };
      return { formal: res };
    }

    // target: draft/formal/history/clone
    async _copy({ target, atomClass, srcKey, srcItem, destKey, options, user }) {
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      // srcItem
      if (!srcItem) {
        srcItem = await ctx.bean.atom.read({ key: { atomId: srcKey.atomId }, atomClass, user: null });
      }
      // destItem
      let destItem;
      if (!atomClassBase.itemOnly) {
        destItem = this._copy_prepareDestItem_normal({ target, srcItem, user });
      } else {
        destItem = this._copy_prepareDestItem_itemOnly({ target, srcItem, user });
      }
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
        if (!atomClassBase.itemOnly) {
          const _item = await this.modelAtom.get({ id: destKey.atomId });
          destKey.itemId = _item.itemId;
        } else {
          destKey.itemId = destKey.atomId;
        }
      }
      // append destKey
      destItem.atomId = destKey.atomId;
      destItem.itemId = destKey.itemId;
      // update atom fields
      if (!atomClassBase.itemOnly) {
        await this._copy_updateAtomFields({ target, destItem });
      }
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
      if (!atomClassBase.itemOnly) {
        await this._copyAttachments({ atomIdSrc: srcKey.atomId, atomIdDest: destKey.atomId });
      }
      // copy details
      // todo: itemOnly maybe has details
      if (!atomClassBase.itemOnly) {
        await ctx.bean.detail._copyDetails({
          atomClass,
          target,
          srcKeyAtom: srcKey,
          destKeyAtom: destKey,
          destAtom: destItem,
          options,
          user,
        });
      }
      // ok
      return destKey;
    }

    async _copy_updateAtomFields({ target, destItem }) {
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
    }

    _copy_prepareDestItem_itemOnly({ /* target,*/ srcItem, user }) {
      // destItem
      const destItem = Object.assign({}, srcItem, {
        // atomId: destKey.atomId,
        // itemId: destKey.itemId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return destItem;
    }

    _copy_prepareDestItem_normal({ target, srcItem, user }) {
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
      let createdAt = srcItem.atomCreatedAt;
      let updatedAt = srcItem.atomUpdatedAt;
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
        createdAt = new Date();
        updatedAt = new Date();
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
        createdAt,
        updatedAt,
      });
      return destItem;
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
  }

  return Atom;
};
