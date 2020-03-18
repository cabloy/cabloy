module.exports = app => {

  class AtomClass extends app.Service {

    async register({ module, atomClassName, atomClassIdParent }) {
      return await this.ctx.meta.atomClass.register({ module, atomClassName, atomClassIdParent });
    }

    async validatorSearch({ atomClass }) {
      return await this.ctx.meta.atomClass.validatorSearch({ atomClass });
    }

    async checkRightCreate({ atomClass, user }) {
      return await this.ctx.meta.atom.checkRightCreate({ atomClass, user });
    }

    async atomClass({ atomClass }) {
      return await this.ctx.meta.atomClass.get(atomClass);
    }

  }

  return AtomClass;
};
