module.exports = app => {

  class Mail extends app.Service {

    async create({ atomClass, key, item, user }) {
      // add mail
      const res = await this.ctx.model.mail.insert({
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

    async write({ atomClass, key, item, user }) {
      // update mail
      await this.ctx.model.mail.update({
        id: key.itemId,
        description: item.description,
      });
    }

    async delete({ atomClass, key, user }) {
      // delete mail
      await this.ctx.model.mail.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
    }

    async enable({ atomClass, key, atom, user }) {
    }

  }

  return Mail;
};
