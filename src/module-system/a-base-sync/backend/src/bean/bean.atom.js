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
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, item, user },
        fn: 'write',
      });
    }

    // delete
    async delete({ key, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
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

    // action
    async action({ action, key, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { action, atomClass, key, user },
        fn: 'action',
      });
    }

    async submit({ key, options, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
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

    async _submitDirect({ key, item, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      //
      let itemArchive;
      let keyArchive;
      // archive -> history
      if (item.atomIdArchive) {
        // item
        itemArchive = await ctx.bean.atom.read({ key: { atomId: item.atomIdArchive }, user });
        keyArchive = { atomId: itemArchive.atomId, itemId: itemArchive.itemId };
        // create history
        const keyHistory = await this.create({ atomClass, roleIdOwner: itemArchive.roleIdOwner, item: itemArchive, user });
        // update fields
        await this.modelAtom.update({
          id: keyHistory.atomId,
          atomStage: ctx.constant.module(moduleInfo.relativeName).atom.stage.history,
          atomFlowId: itemArchive.atomFlowId,
          allowComment: itemArchive.allowComment,
          attachmentCount: itemArchive.attachmentCount,
          atomClosed: 0,
          atomIdDraft: item.atomId,
          atomIdArchive: item.atomIdArchive,
        });
        // copy attachments
        await this._copyAttachments({ atomIdSrc: item.atomIdArchive, atomIdDest: keyHistory.atomId });
        // history
        await ctx.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: keyHistory, item: itemArchive, user },
          fn: 'history',
        });
      }
      // draft -> archive
      if (!item.atomIdArchive) {
        // create archive
        keyArchive = await this.create({ atomClass, roleIdOwner: item.roleIdOwner, item, user });
      }
      // update fields
      await this.modelAtom.update({
        id: keyArchive.atomId,
        atomStage: ctx.constant.module(moduleInfo.relativeName).atom.stage.archive,
        atomFlowId: item.atomFlowId,
        allowComment: item.allowComment,
        attachmentCount: item.attachmentCount,
        atomClosed: 0,
        atomIdDraft: item.atomId,
      });
      // copy attachments
      await this._copyAttachments({ atomIdSrc: item.atomId, atomIdDest: keyArchive.atomId });
      // history
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key: keyArchive, item, user },
        fn: 'archive',
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

    async openDraft({}) {
      // todo:
    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flag({ key, atom: { atomFlag } /* user*/ }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomFlag,
      });
    }

    async flow({ key, atom: { atomFlowId } }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomFlowId,
      });
    }

    async star({ key, atom: { star = 1 }, user }) {
      let diff = 0;
      // check if exists
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
      // get
      const atom = await this.get({ atomId: key.atomId });
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

    async actions({ key, basic, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      // actions
      const _basic = basic ? 'and a.code<100' : '';
      const sql = `
        select a.*,b.module,b.atomClassName from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      const actions = await ctx.model.query(sql, [ ctx.instance.id, atomClass.id ]);
      // actions res
      const actionsRes = [];
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      for (const action of actions) {
        if (action.code === _actionsSystem.write || action.code === _actionsSystem.delete) {
          const res = await this.checkRightUpdate({ atom: { id: key.atomId, action: action.code }, user });
          if (res) actionsRes.push(action);
        } else if (action.code > _actionsSystem.custom) {
          const res = await this.checkRightAction({ atom: { id: key.atomId, action: action.code }, user });
          if (res) actionsRes.push(action);
        }
      }
      return actionsRes;
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
      atom: { itemId, atomName, atomFlag = 0, roleIdOwner = 0 },
      user,
    }) {
      let atomClassId = id;
      if (!atomClassId) atomClassId = await this.getAtomClassId({ atomClassName, atomClassIdParent });
      const res = await this.modelAtom.insert({
        atomStage: 0,
        atomFlag,
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

    async _get({ atom: { id, tableName }, user }) {
      const sql = this.sqlProcedure.getAtom({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, atomId: id,
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

    async checkRightUpdate({ atom: { id, action, stage }, user }) {
      const _atom = await this.modelAtom.get({ id });
      if ((stage === 'draft' && _atom.atomStage > 0) || (stage === 'archive' && _atom.atomStage === 0)) return null;
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
      // check archive
      const sql = this.sqlProcedure.checkRightUpdate({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
        action,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightAction({ atom: { id, action }, user }) {
      const _atom = await this.modelAtom.get({ id });
      if (_atom.atomStage === 0) {
        // 1. closed
        if (_atom.atomClosed) return null;
        // 2. self
        if (_atom.userIdUpdated === user.id) return _atom;
        // others
        return null;
      }
      // check archive
      const sql = this.sqlProcedure.checkRightAction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
        action,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightCreate({
      atomClass: { id, module, atomClassName, atomClassIdParent = 0 },
      user,
    }) {
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const sql = this.sqlProcedure.checkRightCreate({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClassId: id,
      });
      return await ctx.model.queryOne(sql);
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

    _upperCaseFirstChar(str) {
      if (!str) return '';
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    _getTableName({ atomClass, mode }) {
      mode = this._upperCaseFirstChar(mode);
      if (mode === 'Search') {
        return atomClass.tableNameSearch || atomClass.tableNameFull || atomClass.tableName;
      }
      // special: all = list + atomEnabled=0
      return atomClass[`tableName${mode}`] || atomClass.tableName;
    }

  }

  return Atom;
};
