module.exports = app => {

  class {{atomClassNameCapitalize}} extends app.Service {

    async create({ atomClass, key, item, user }) {
      // add {{atomClassName}}
      const res = await this.ctx.model.{{atomClassName}}.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, item, user }) {
      // read
    }

    async select({ atomClass, options, items, user }) {
      // select
    }

    async write({ atomClass, key, item, validation, user }) {
      // update {{atomClassName}}
      await this.ctx.model.{{atomClassName}}.update({
        id: key.itemId,
        description: item.description,
      });
    }

    async delete({ atomClass, key, user }) {
      // delete {{atomClassName}}
      await this.ctx.model.{{atomClassName}}.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
    }

    async enable({ atomClass, key, atom, user }) {
    }

  }

  return {{atomClassNameCapitalize}};
};
