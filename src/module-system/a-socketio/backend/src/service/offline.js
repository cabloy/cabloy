module.exports = app => {

  class Offline extends app.Service {

    async offset({ messageClass, options, user }) {
      return await this.ctx.meta.io.offline.offset({ messageClass, options, user });
    }

  }

  return Offline;
};
