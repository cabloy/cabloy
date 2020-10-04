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
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, user },
        fn: 'delete',
      });
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
      const ignoreFlow = options && options.ignoreFlow;
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage > 0) ctx.throw(403);
      // check atom flow
      if (!ignoreFlow) {
        const _nodeBaseBean = ctx.bean._newBean('a-flownode.flow.node.startEventAtom');
        const flowInstance = await _nodeBaseBean._match({ atom: _atom, user });
        if (flowInstance) {
          // set atom flow
          await this.flow({ key, atom: { atomFlowId: flowInstance.context._flowId }, user });
          return;
        }
      }
      return await this.submitDirect({ key, atom: _atom, user });
    }

    async submitDirect({ key, atom, user }) {
      // todo:
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, atom, user },
        fn: 'submit',
      });
    }

    async toDraft({}) {
      // todo:
    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flag({ key, atom: { atomFlag }, user }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomFlag,
        userIdUpdated: user.id,
      });
    }

    async flow({ key, atom: { atomFlow }, user }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomFlow,
        userIdUpdated: user.id,
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
          // userIdUpdated: user.id,
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
      atom: { itemId, atomName, atomFlag = 0, atomFlow = 0, roleIdOwner = 0 },
      user,
    }) {
      let atomClassId = id;
      if (!atomClassId) atomClassId = await this.getAtomClassId({ atomClassName, atomClassIdParent });
      const res = await this.modelAtom.insert({
        atomEnabled: 0, // must be enabled by enable
        atomFlag,
        atomFlow,
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
      atom: { id, atomName, allowComment, atomFlow, itemId },
      user,
    }) {
      const params = { id, userIdUpdated: user.id };
      if (atomName !== undefined) params.atomName = atomName;
      if (allowComment !== undefined) params.allowComment = allowComment;
      if (atomFlow !== undefined) params.atomFlow = atomFlow;
      if (itemId !== undefined) params.itemId = itemId;
      params.updatedAt = new Date();
      await this.modelAtom.update(params);
    }

    async _delete({
      atom,
      user,
    }) {
      await this._update({ atom, user });
      await this.modelAtom.delete(atom);
    }

    async _get({ atom: { id, tableName }, user }) {
      const sql = this.sqlProcedure.getAtom({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, atomId: id,
      });
      return await ctx.model.queryOne(sql);
    }

    async _list({ tableName, options: { where, orders, page, star = 0, label = 0, comment = 0, file = 0 }, user, pageForce = true, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);

      const sql = this.sqlProcedure.selectAtoms({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, where, orders, page,
        star, label, comment, file, count,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    // right

    async checkRoleRightRead({ atom: { id }, roleId }) {
      const res = await ctx.model.query('call aCheckRoleRightRead(?,?,?)',
        [ ctx.instance.id, roleId, id ]
      );
      return res[0][0];
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
      const actionFlag = await ctx.bean.atomAction.getFlagByAtomId({ atomId: id, code: action });
      const sql = this.sqlProcedure.checkRightAction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
        action, actionFlag,
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
