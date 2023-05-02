module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomBase extends app.meta.BeanBase {
    async submit({ atomClass, key, options, user }) {
      return await this.ctx.bean.atom._submitBase({ atomClass, key, options, user });
    }

    async enable({ /* atomClass,*/ key /* , options*/ /* , user*/ }) {
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId,
        atomDisabled: 0,
      });
    }

    async disable({ /* atomClass,*/ key /* , options*/ /* , user*/ }) {
      await this.ctx.bean.atom.modelAtom.update({
        id: key.atomId,
        atomDisabled: 1,
      });
    }

    async copy(/* { atomClass, target, srcKey, srcItem, destKey, destItem, user }*/) {
      // do nothing
    }

    async importBulk(/* {  atomClass, options, file , user }*/) {
      // do nothing
    }

    async checkRightAction({ atom, atomClass, action, options, user }) {
      return await this.ctx.bean.atom._checkRightAction({ atom, atomClass, action, options, user });
    }

    async prepareStaticItem({ moduleName, atomClass, item, register }) {
      return await this.ctx.bean.atomStatic._adjustItem_base({ moduleName, atomClass, item, register });
    }
  }
  return AtomBase;
};
