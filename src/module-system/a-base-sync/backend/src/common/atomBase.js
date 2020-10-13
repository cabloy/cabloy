module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase extends app.meta.BeanBase {

    async create({ atomClass, item, user }) {
      // atomName
      if (!item.atomName) {
        // draftId
        const sequence = this.ctx.bean.sequence.module(moduleInfo.relativeName);
        const draftId = await sequence.next('draft');
        item.atomName = `${this.ctx.text('Draft')}-${draftId}`;
      }
      // add
      const atomId = await this.ctx.bean.atom._add({ atomClass, atom: item, user });
      return { atomId };
    }

    async read({ atomClass, key, user }) {
      // get
      return await this.ctx.bean.atom._get({ atomClass, key, mode: 'full', user });
    }

    async select(/* {  atomClass, options, items, user }*/) {
      // donothing
    }

    async delete({ /* atomClass,*/ key, user }) {
      await this.ctx.bean.atom._delete({
        atom: { id: key.atomId },
        user,
      });
    }

    async write({ atomClass, key, item, user }) {
      const atomStage = item.atomStage;
      // validator
      if (atomStage === 0) {
        const validator = await this.ctx.bean.atom.validator({ atomClass, user });
        if (validator) {
          // if error throw 422
          await this.ctx.bean.validation.validate({
            module: validator.module,
            validator: validator.validator,
            schema: validator.schema,
            data: item,
          });
        }
      }
      // write atom
      await this._writeAtom({ key, item, user, atomStage });
    }

    async _writeAtom({ key, item, user, atomStage }) {
      if (!item || atomStage > 0) return;
      // write atom
      const atom = { };
      if (item.atomName !== undefined) atom.atomName = item.atomName;
      if (item.allowComment !== undefined) atom.allowComment = item.allowComment;
      if (Object.keys(atom).length > 0) {
        atom.id = key.atomId;
        await this.ctx.bean.atom._update({ atom, user });
      }
    }

    async submit({ /* atomClass,*/ key, options, user }) {
      const ignoreFlow = options && options.ignoreFlow;
      const _atom = await this.ctx.bean.atom.read({ key, user });
      if (_atom.atomStage > 0) this.ctx.throw(403);
      // check atom flow
      if (!ignoreFlow) {
        const _nodeBaseBean = this.ctx.bean._newBean('a-flownode.flow.node.startEventAtom');
        const flowInstance = await _nodeBaseBean._match({ atom: _atom, userId: _atom.userIdUpdated });
        if (flowInstance) {
          // set atom flow
          const atomFlowId = flowInstance.context._flowId;
          await this.ctx.bean.atom.flow({ key, atom: { atomFlowId } });
          return { flow: { id: atomFlowId } };
        }
      }
      return await this.ctx.bean.atom._submitDirect({ key, item: _atom, user });
    }

    async history({ atomClass, key, item, user }) {
      await this.write({ atomClass, key, item, user });
    }

    async archive({ atomClass, key, item, user }) {
      await this.write({ atomClass, key, item, user });
    }

    async action(/* { action, atomClass, key, user }*/) {
      // donothing
    }

  }
  return AtomBase;
};
