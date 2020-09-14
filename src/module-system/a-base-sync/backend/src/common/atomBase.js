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
      // atomFlow
      if (item.atomFlow === undefined) {
        item.atomFlow = atomClass.flow;
      }
      // add
      const atomId = await this.ctx.bean.atom._add({ atomClass, atom: item, user });
      return { atomId };
    }

    async read({ atomClass, key, user }) {
      const _atomClass = await this.ctx.bean.atomClass.atomClass(atomClass);
      // get
      return await this.ctx.bean.atom._get({
        atom: {
          id: key.atomId,
          tableName: _atomClass.tableNameFull || _atomClass.tableName,
        },
        user,
      });
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
      // validator
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
      // write atom
      await this._writeAtom({ key, item, user });
    }

    async _writeAtom({ key, item, user }) {
      if (!item) return;
      // write atom
      const atom = { };
      if (item.atomName !== undefined) atom.atomName = item.atomName;
      if (item.allowComment !== undefined) atom.allowComment = item.allowComment;
      if (Object.keys(atom).length > 0) {
        atom.id = key.atomId;
        await this.ctx.bean.atom._update({ atom, user });
      }
    }

    async enable({ /* atomClass,*/ key, atom, user }) {
      // update
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId,
        atomEnabled: atom.atomEnabled,
        userIdUpdated: user.id,
      });
    }

    async action(/* { action, atomClass, key, user }*/) {
      // donothing
    }

  }
  return AtomBase;
};
