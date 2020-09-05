module.exports = app => {

  class Atom extends app.Service {

    async preferredRoles({ atomClass, user }) {
      return await this.ctx.bean.atom.preferredRoles({ atomClass, user });
    }

    async create({ atomClass, roleIdOwner, item, user }) {
      return await this.ctx.bean.atom.create({ atomClass, roleIdOwner, item, user });
    }

    async read({ key, user }) {
      return await this.ctx.bean.atom.read({ key, user });
    }

    async select({ atomClass, options, user }) {
      return await this.ctx.bean.atom.select({ atomClass, options, user });
    }

    async count({ atomClass, options, user }) {
      return await this.ctx.bean.atom.count({ atomClass, options, user });
    }

    async write({ key, item, user }) {
      return await this.ctx.bean.atom.write({ key, item, user });
    }

    async delete({ key, user }) {
      return await this.ctx.bean.atom.delete({ key, user });
    }

    async action({ action, key, user }) {
      return await this.ctx.bean.atom.action({ action, key, user });
    }

    async enable({ key, atom, user }) {
      return await this.ctx.bean.atom.enable({ key, atom, user });
    }

    async star({ key, atom, user }) {
      return await this.ctx.bean.atom.star({ key, atom, user });
    }

    async readCount({ key, atom, user }) {
      return await this.ctx.bean.atom.readCount({ key, atom, user });
    }

    async labels({ key, atom, user }) {
      return await this.ctx.bean.atom.labels({ key, atom, user });
    }

    async actions({ key, basic, user }) {
      return await this.ctx.bean.atom.actions({ key, basic, user });
    }

    async schema({ atomClass, schema, user }) {
      return await this.ctx.bean.atom.schema({ atomClass, schema, user });
    }

    async validator({ atomClass, user }) {
      return await this.ctx.bean.atom.validator({ atomClass, user });
    }

  }

  return Atom;
};
