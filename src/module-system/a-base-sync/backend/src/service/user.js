module.exports = app => {

  class User extends app.Service {

    async getLabels({ user }) {
      const res = await this.ctx.model.label.get({
        userId: user.id,
      });
      return res ? JSON.parse(res.labels) : null;
    }

    async setLabels({ labels, user }) {
      const labels2 = JSON.stringify(labels);
      const res = await this.ctx.model.label.get({
        userId: user.id,
      });
      if (!res) {
        await this.ctx.model.label.insert({
          userId: user.id,
          labels: labels2,
        });
      } else {
        await this.ctx.model.label.update({
          id: res.id,
          labels: labels2,
        });
      }
    }

  }

  return User;
};
