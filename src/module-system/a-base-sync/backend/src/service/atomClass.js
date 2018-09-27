module.exports = app => {

  class AtomClass extends app.Service {

    async register({ module, atomClassName, atomClassIdParent }) {
      return await this.ctx.meta.atomClass.register({ module, atomClassName, atomClassIdParent });
    }

    validatorSearch({ module, atomClassName }) {
      return this.ctx.meta.atomClass.validatorSearch({ module, atomClassName });
    }

    async checkRightCreate({ atomClass, user }) {
      return await this.ctx.meta.atom.checkRightCreate({ atomClass, user });
    }

  }

  return AtomClass;
};
