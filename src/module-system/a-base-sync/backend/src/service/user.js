module.exports = app => {
  class User extends app.Service {
    async getLabels({ user }) {
      return await this.ctx.bean.atom.getLabels({ user });
    }

    async setLabels({ labels, user }) {
      return await this.ctx.bean.atom.setLabels({ labels, user });
    }
  }

  return User;
};
