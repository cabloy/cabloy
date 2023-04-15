const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async checkRightAction({ atom: { id }, atomClass, action, stage, user, checkFlow, disableAuthOpenCheck }) {
      const _res = await this._prepareAtomAndAtomClass({ atomId: id, atomClass });
      const _atom = _res.atom;
      atomClass = _res.atomClass;
      // normal check
      const res = await this._checkRightAction_normal({ _atom, atomClass, action, stage, user, checkFlow });
      if (!res) return res;
      // auth open check
      if (!disableAuthOpenCheck) {
        const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action });
        if (!resAuthOpenCheck) return null;
      }
      // ok
      return res;
    }

    async _checkRightAction_normal({ _atom, atomClass, action, stage, user, checkFlow }) {
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // parse action code
      action = ctx.bean.atomAction.parseActionCode({
        action,
        atomClass,
      });
      // check right
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      return await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atom: _atom, atomClass, action, stage, user, checkFlow },
        fn: 'checkRightAction',
      });
    }

    async _checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      const _atom = atom;
      if (!_atom) ctx.throw.module(moduleInfo.relativeName, 1002);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      if (atomClassBase.itemOnly) {
        // check basic
        return await this._checkRightAction_itemOnly({ atomClass, _atom, action, user });
      }
      // adjust for simple
      if (stage === 'draft' && _atom.atomSimple === 1) stage = 'formal';
      // action.stage
      if (
        (stage === 'draft' && _atom.atomStage > 0) ||
        ((stage === 'formal' || stage === 'history') && _atom.atomStage === 0)
      ) {
        return null;
      }
      // flow action
      if (action >= 10000) {
        const task = await this._checkRightAction_flowAction({ _atom, atomClass, action, user });
        if (!task) return null;
        _atom.__task = task;
        return _atom;
      }
      // actionBase
      const actionBase = ctx.bean.base.action({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        code: action,
      });
      // if (!actionBase) throw new Error(`action not found: ${atomClass.module}:${atomClass.atomClassName}:${action}`);
      if (!actionBase) {
        if (action < 10000) {
          await ctx.bean.atomAction.delete({ atomClassId: atomClass.id, code: action });
        }
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
        // self
        const bSelf = _atom.userIdUpdated === user.id;
        // except action=4 and atomStage===0
        if (action === 4 && _atom.atomStage === 0 && _atom.atomClosed === 0 && bSelf) {
          return _atom;
        }
        return null;
      }
      // draft
      if (_atom.atomStage === 0) {
        return await this._checkRightAction_draft({ atomClass, actionBase, _atom, action, user, checkFlow });
      }
      // not draft
      return await this._checkRightAction_not_draft({ atomClass, actionBase, _atom, action, user, checkFlow });
    }

    async _checkRightAction_flowAction({ _atom, atomClass, action, user }) {
      // actionItem
      const actionItem = await ctx.bean.atomAction.model.get({ atomClassId: atomClass.id, code: action });
      if (!actionItem) return null;
      // flowTask
      const task = await ctx.bean.flowTask.get({
        options: {
          where: {
            'b.flowNodeDefId': actionItem.nodeDefId,
            'c.flowDefKey': actionItem.flowKey,
            'c.flowAtomId': _atom.id,
          },
          history: 0,
        },
        user,
      });
      return task;
    }

    async _checkRightAction_draft({ atomClass, actionBase, _atom, action, user, checkFlow }) {
      // _atomFormal
      let _atomFormal;
      if (_atom.atomIdFormal) {
        _atomFormal = await this.modelAtom.get({ id: _atom.atomIdFormal });
      }
      // self
      const bSelf = _atom.userIdUpdated === user.id;
      // checkFlow
      if (_atom.atomFlowId > 0 && checkFlow) {
        const flow = await ctx.bean.flow.get({ flowId: _atom.atomFlowId, history: true, user });
        if (flow) return _atom;
      }
      // 1. closed
      if (_atom.atomClosed) {
        // enable on 'self and write', not including 'delete'
        if (bSelf && action === 3) {
          // return _atom;
          if (_atomFormal) {
            return await this._checkRightAction({
              atom: _atomFormal,
              atomClass,
              action,
              stage: 'formal',
              user,
              checkFlow: false,
            });
          }
        }
        return null;
      }
      // 2. flow
      const enableOnFlowing = actionBase.enableOnFlowing !== false;
      const isFlowing = this._checkRightAction_isFlowing({ atom: _atom, atomAnother: _atomFormal });
      if (!enableOnFlowing && isFlowing) return null;
      // 3. self
      if (bSelf) return _atom;
      // others
      return null;
    }

    _checkRightAction_isFlowing({ atom, atomAnother }) {
      const a = atom && atom.atomFlowId > 0 && atom.atomClosed === 0;
      const b = atomAnother && atomAnother.atomFlowId > 0 && atomAnother.atomClosed === 0;
      return a || b;
    }

    async _checkRightAction_not_draft({ atomClass, actionBase, _atom, action, user, checkFlow }) {
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
        return await this._checkRightAction({
          atom: _atomDraft,
          atomClass,
          action,
          stage: 'draft',
          user,
          checkFlow: false,
        });
      }
      // checkFlow
      if (_atom.atomFlowId > 0 && !_atom.atomClosed && checkFlow) {
        const flow = await ctx.bean.flow.get({ flowId: _atom.atomFlowId, history: true, user });
        if (flow) return _atom;
      }
      // check enableOnOpened
      const enableOnOpened = actionBase.enableOnOpened !== false;
      if (_atomDraft && !_atomDraft.atomClosed && !enableOnOpened) return null;
      // flow
      const enableOnFlowing = actionBase.enableOnFlowing !== false;
      const isFlowing = this._checkRightAction_isFlowing({ atom: _atom, atomAnother: _atomDraft });
      if (!enableOnFlowing && isFlowing) return null;
      // enable/disable
      if (action === 6 && _atom.atomDisabled === 0) return null;
      if (action === 7 && _atom.atomDisabled === 1) return null;
      // workflowFormal
      if (action === 16 && _atom.atomFlowId === 0) return null;
      // check basic
      return await this._checkRightAction_basic({ atomClass, _atom, action, user });
    }

    async _checkRightAction_itemOnly({ atomClass, _atom, action, user }) {
      // check basic
      return await this._checkRightAction_basic({ atomClass, _atom, action, user });
    }

    async _checkRightAction_basic({ atomClass, _atom, action, user }) {
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // check formal/history
      const sql = await this.sqlProcedure.checkRightAction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        atomClassBase,
        atomId: _atom.id,
        action,
        forAtomUser,
      });
      if (sql === false) return null;
      return await ctx.model.queryOne(sql);
    }
  }

  return Atom;
};
