const require3 = require('require3');
// const debug = require3('debug')('sql');
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

    get modelLabel() {
      return ctx.model.module(moduleInfo.relativeName).label;
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

    // atom and item

    // create
    async create({ atomClass, atomStage, roleIdOwner, item, options, createOptions, user }) {
      options = options || {};
      if (createOptions) {
        options.createOptions = createOptions;
      }
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // atomSimple
      const atomSimple = Number(Boolean(_atomClass.simple));
      // item
      item = item || {};
      item.atomStage = atomStage !== undefined ? atomStage : atomSimple;
      item.roleIdOwner = roleIdOwner;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const res = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, item, options, user },
        fn: 'create',
      });
      const { atomId, itemId } = res;
      // save itemId
      await this._update({
        atom: { id: atomId, itemId },
        user,
      });
      // notify
      this._notifyDraftsDrafting(null, atomClass);
      // ok
      const key = { atomId, itemId };
      const returnAtom = options.returnAtom;
      if (!returnAtom) return key;
      // read
      item = await this.read({ key, user });
      return { key, atom: item };
    }

    // read
    async read({ key, options, user }) {
      options = options || {};
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const item = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, key, user },
        fn: 'read',
      });
      // ok
      return item;
    }

    // readByStaticKey
    async readByStaticKey({ atomClass, atomStaticKey, atomRevision, atomStage }) {
      const options = {
        mode: 'full',
        stage: atomStage,
        where: {
          'a.atomStaticKey': atomStaticKey,
        },
      };
      if (atomRevision !== undefined) {
        options.where['a.atomRevision'] = atomRevision;
      }
      const list = await this.select({ atomClass, options });
      return list[0];
    }

    // count
    async count({ atomClass, options, user }) {
      return await this.select({ atomClass, options, user, count: 1 });
    }

    // select
    async select({ atomClass, options, user, pageForce = true, count = 0 }) {
      if (!options) options = {};
      if (!options.where) options.where = {};
      if (!options.orders) options.orders = [];
      // atomClass
      let _atomClass;
      let _moduleInfo;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
        _moduleInfo = mparse.parseInfo(atomClass.module);
      }
      // selectBefore
      if (atomClass) {
        const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, options, user },
          fn: 'selectBefore',
        });
      }
      // tableName
      let tableName = '';
      if (_atomClass) {
        tableName = await this.getTableName({
          atomClass,
          atomClassBase: _atomClass,
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
      const cms = _atomClass && _atomClass.cms;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // useAreaScope
      const useAreaScope = this._checkUseAreaScope(atomClass);
      // select
      const items = await this._list({
        tableName,
        options,
        cms,
        forAtomUser,
        useAreaScope,
        user,
        pageForce,
        count,
      });
      // select items
      if (!count) {
        if (atomClass) {
          const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, options, items, user },
            fn: 'select',
          });
        } else {
          await ctx.bean.atomBase.select({ atomClass, options, items, user });
        }
      }
      // ok
      return items;
    }

    // write
    //   target: should be null for frontend call
    async write({ key, target, item, options, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // basic info
      const _atomBasic = await this.modelAtom.get({ id: key.atomId });
      if (_atomBasic.atomStage !== _atomBasic.atomSimple) ctx.throw(403);
      if (_atomBasic.atomSimple) {
        if (_atomClass.history !== false) {
          //  formal -> history
          await this._copy({
            target: 'history',
            srcKey: { atomId: key.atomId },
            srcItem: null,
            destKey: null,
            options,
            user,
          });
        }
      }
      // write draft/formal(simple)
      const itemWrite = Object.assign({}, item, {
        atomId: key.atomId,
        itemId: key.itemId,
        atomSimple: _atomBasic.atomSimple,
        atomStage: _atomBasic.atomSimple ? 1 : 0,
      });
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, target, key, item: itemWrite, options, user },
        fn: 'write',
      });
      // update formal version for simple
      if (_atomBasic.atomSimple) {
        await this.modelAtom.update({
          id: key.atomId,
          atomRevision: _atomBasic.atomRevision + 1,
        });
      }
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

    // delete
    async delete({ key, options, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // atom
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage === 0) {
        // close draft
        await this.closeDraft({ key });
      } else if (_atom.atomStage === 1) {
        // delete history
        const listHistory = await this.modelAtom.select({
          where: {
            atomStage: 2,
            atomIdFormal: _atom.id,
          },
        });
        for (const item of listHistory) {
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: item.id, itemId: item.itemId }, options, user },
            fn: 'delete',
          });
        }
        // delete draft
        const itemDraft = await this.modelAtom.get({
          atomStage: 0,
          atomIdFormal: _atom.id,
        });
        if (itemDraft) {
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: itemDraft.id, itemId: itemDraft.itemId }, options, user },
            fn: 'delete',
          });
          // notify
          this._notifyDraftsDrafting(null, atomClass);
        }
        // delete formal
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, options, user },
          fn: 'delete',
        });
      } else if (_atom.atomStage === 2) {
        // delete history self
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, options, user },
          fn: 'delete',
        });
      }
    }

    async submit({ key, options, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomSimple === 1 && _atom.atomStage === 1) {
        // if simple, just return formal, so as for compatible with not simple
        return { formal: { key } };
      }
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      return await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, options, user },
        fn: 'submit',
      });
    }

    async closeDraft({ key }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // draft
      const atomIdDraft = key.atomId;
      const atomDraft = await this.modelAtom.get({ id: atomIdDraft });
      const user = { id: atomDraft.userIdUpdated };
      // ** update draft from formal
      if (atomDraft.atomIdFormal) {
        await this._copy({
          target: 'draft',
          srcKey: { atomId: atomDraft.atomIdFormal },
          srcItem: null,
          destKey: key,
          user,
        });
        // update atomClosed
        await this.modelAtom.update({
          id: atomIdDraft,
          atomClosed: 1,
        });
      } else {
        // not delete draft if atomFlowId>0
        if (atomDraft.atomFlowId > 0) {
          // update atomClosed
          await this.modelAtom.update({
            id: atomIdDraft,
            atomClosed: 1,
            atomRevision: atomDraft.atomRevision - 1,
          });
        } else {
          // delete
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key, user },
            fn: 'delete',
          });
        }
      }
      // notify
      this._notifyDraftsDrafting(user, atomClass);
      this._notifyDraftsFlowing(user, atomClass);
    }

    async enable({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, user },
        fn: 'enable',
      });
    }

    async disable({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, user },
        fn: 'disable',
      });
    }

    async clone({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // copy
      const keyDraft = await this._copy({
        target: 'clone',
        srcKey: { atomId: key.atomId },
        srcItem: null,
        destKey: null,
        user,
      });
      // ok
      // get atom
      const atom = await this.read({ key: keyDraft, user });
      // draft/formal
      const res = { key: keyDraft, atom };
      if (atom.atomStage === 0) return { draft: res };
      return { formal: res };
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
      const resExport = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, fields, items, user },
        fn: 'exportBulk',
      });
      // file
      const resFile = await ctx.bean.file._upload({
        fileContent: resExport.data,
        meta: resExport.meta,
        user,
      });
      // ok
      return resFile;
    }

    async importBulk({ atomClass, options, file, user }) {
      // atomClass
      let _atomClass;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // options
      if (!options) {
        const actionBase = ctx.bean.base.action({
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
          name: 'importBulk',
        });
        // options
        options = actionBase.params;
      }
      try {
        // prepare file
        if (options.file.mode === 'buffer') {
          const res = await ctx.bean.file.loadBuffer({ downloadId: file.downloadId });
          options.file.buffer = res.buffer;
        }
        // import
        let resImport;
        if (options.transaction) {
          resImport = await ctx.transaction.begin(async () => {
            return await this._importBulk_inner({ atomClass, _atomClass, options, file, user });
          });
        } else {
          resImport = await this._importBulk_inner({ atomClass, _atomClass, options, file, user });
        }
        // ok
        return resImport;
      } finally {
        // delete file
        await ctx.bean.file.delete({ downloadId: file.downloadId });
      }
    }

    async _importBulk_inner({ atomClass, _atomClass, options, file, user }) {
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      return await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, file, user },
        fn: 'importBulk',
      });
    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flow({ key, atom: { atomFlowId } }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      await this.modelAtom.update({
        id: key.atomId,
        atomFlowId,
      });
      // notify
      const item = await this.modelAtom.get({ id: key.atomId });
      const user = { id: item.userIdUpdated };
      this._notifyDraftsDrafting(user, atomClass);
      this._notifyDraftsFlowing(user, atomClass);
    }

    async readCount({ key, atom: { readCount = 1 }, user }) {
      await this.modelAtom.query('update aAtom set readCount = readCount + ? where iid=? and id=?', [
        readCount,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async comment({ key, atom: { comment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set commentCount = commentCount + ? where iid=? and id=?', [
        comment,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async attachment({ key, atom: { attachment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set attachmentCount = attachmentCount + ? where iid=? and id=?', [
        attachment,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async stats({ atomIds, user }) {
      const list = [];
      for (const atomId of atomIds) {
        const res = await this.checkRightRead({ atom: { id: atomId }, user, checkFlow: true });
        if (res) {
          list.push({
            id: atomId,
            atomId,
            readCount: res.readCount,
            commentCount: res.commentCount,
            starCount: res.starCount,
          });
        }
      }
      return list;
    }

    async schema({ atomClass, schema }) {
      const validator = await this.validator({ atomClass });
      if (!validator) return null;
      return ctx.bean.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
    }

    async validator({ atomClass }) {
      atomClass = await this.atomClass.get(atomClass);
      atomClass = await this.atomClass.top(atomClass);
      return await this.atomClass.validator({ atomClass });
    }

    async getTableName({ atomClass, atomClassBase, options, mode, user, action, key, count }) {
      const tableNameModes = atomClassBase.tableNameModes || {};
      let tableName;
      if (mode === 'search') {
        tableName = tableNameModes.search || tableNameModes.full || tableNameModes.default || atomClassBase.tableName;
      } else {
        tableName = tableNameModes[mode] || tableNameModes.default || atomClassBase.tableName;
      }
      if (!tableName) return tableName;
      // if function
      if (typeof tableName !== 'string') {
        tableName = await tableName({ ctx, atomClass, atomClassBase, options, mode, user, action, key, count });
      } else {
        // check if resource
        if (atomClassBase.resource) {
          const optionsResource = options && options.resource;
          if (!optionsResource) {
            tableName = `(
                  select ___a.*,
                    ___c.atomNameLocale
                    from ${tableName} ___a
                    left join aResourceLocale ___c on ___a.atomId=___c.atomId and ___c.locale='${ctx.locale}'
                )`;
          }
        }
      }
      // ok
      return tableName;
    }

    async getAtomClassId({ module, atomClassName, atomClassIdParent = 0 }) {
      ctx.app.meta.util.deprecated('ctx.bean.atom.getAtomClassId', 'ctx.bean.atomClass.get');
      const atomClass = await ctx.bean.atomClass.get({ module, atomClassName, atomClassIdParent });
      return atomClass.id;
    }
  }

  return Atom;
};
