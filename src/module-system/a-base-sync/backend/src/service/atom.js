module.exports = app => {

  class Atom extends app.Service {

    async create({ atomClass, user }) {
      return await this.ctx.meta.atom.create({ atomClass, user });
    }

    async read({ key, user }) {
      return await this.ctx.meta.atom.read({ key, user });
    }

    async select({ atomClass, options, user }) {
      return await this.ctx.meta.atom.select({ atomClass, options, user });
    }

    async write({ key, item, validation, user }) {
      return await this.ctx.meta.atom.write({ key, item, validation, user });
    }

    async delete({ key, user }) {
      return await this.ctx.meta.atom.delete({ key, user });
    }

    async action({ action, key, user }) {
      return await this.ctx.meta.atom.action({ action, key, user });
    }

    async enable({ key, atom, user }) {
      return await this.ctx.meta.atom.enable({ key, atom, user });
    }

    async star({ key, atom, user }) {
      return await this.ctx.meta.atom.star({ key, atom, user });
    }

    async readCount({ key, atom, user }) {
      return await this.ctx.meta.atom.readCount({ key, atom, user });
    }

    async labels({ key, atom, user }) {
      return await this.ctx.meta.atom.labels({ key, atom, user });
    }

    async actions({ key, basic, user }) {
      return await this.ctx.meta.atom.actions({ key, basic, user });
    }

    async schema({ atomClass, schema }) {
      return await this.ctx.meta.atom.schema({ atomClass, schema });
    }

    async validator({ atomClass }) {
      return await this.ctx.meta.atom.validator({ atomClass });
    }

  }

  return Atom;
};
