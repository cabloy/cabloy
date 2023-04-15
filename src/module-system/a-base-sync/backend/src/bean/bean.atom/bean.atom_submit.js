const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
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
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      return await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, options, user },
        fn: 'submit',
      });
    }

    async _submitBase({ /* atomClass,*/ key, options, user }) {
      // ignoreFlow only used by draft
      const ignoreFlow = options && options.ignoreFlow;
      const _atom = await ctx.bean.atom.read({ key, user: null });
      // check atom flow
      if (!ignoreFlow) {
        const _nodeBaseBean = ctx.bean._newBean('a-flowtask.flow.node.startEventAtom');
        const flowInstance = await _nodeBaseBean._match({ atom: _atom, userId: _atom.userIdUpdated });
        if (flowInstance) {
          // set atom flow
          const atomFlowId = flowInstance.context._flowId;
          await ctx.bean.atom.flow({ key, atom: { atomFlowId } });
          // ok
          return {
            flow: { id: atomFlowId },
            draft: {
              key,
              atom: {
                atomId: _atom.atomId,
                module: _atom.module,
                atomClassName: _atom.atomClassName,
                atomStage: _atom.atomStage,
              },
            },
          };
        }
      }
      return await this._submitDirect({ key, item: _atom, options, user });
    }

    async _submitDirect({ key, item, options, user }) {
      // { formal }
      let result = await this._submitDirect_formal({ key, item, options, user });
      // check atom flow
      key = result.formal.key;
      item = { ...item, id: key.itemId, atomId: key.atomId, itemId: key.itemId, atomStage: 1 };
      const _nodeBaseBean = ctx.bean._newBean('a-flowtask.flow.node.startEventAtom');
      const flowInstance = await _nodeBaseBean._match({ atom: item, userId: item.userIdUpdated });
      if (flowInstance) {
        // set atom flow
        const atomFlowId = flowInstance.context._flowId;
        await ctx.bean.atom.flow({ key, atom: { atomFlowId } });
        result = {
          flow: { id: atomFlowId },
          formal: result.formal,
        };
      }
      // ok
      return result;
    }

    async _submitDirect_formal({ key, item, options, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // formal -> history
      if (item.atomIdFormal) {
        if (atomClassBase.history !== false) {
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
      // ok
      return { formal: { key: keyFormal, atom: atomFormal } };
    }
  }
  return Atom;
};
