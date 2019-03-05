module.exports = app => {

  class Post extends app.Service {

    async create({ atomClass, key, item, user }) {
      // add post
      const res = await this.ctx.model.post.insert({
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
      // update post
      await this.ctx.model.post.update({
        id: key.itemId,
        description: item.description,
      });
    }

    async delete({ atomClass, key, user }) {
      // delete post
      await this.ctx.model.post.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
    }

    async enable({ atomClass, key, atom, user }) {
    }

  }

  return Post;
};
