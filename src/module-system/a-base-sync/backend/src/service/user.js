module.exports = app => {

  class User extends app.Service {

    async getLabels({ user }) {
      const data = await this.ctx.model.label.get({
        userId: user.id,
      });
      let labels = data ? JSON.parse(data.labels) : null;
      if (!labels || Object.keys(labels).length === 0) {
        // append default labels
        labels = {
          1: {
            color: '#FC6360',
            text: this.ctx.text('Red'),
          },
          2: {
            color: '#FDA951',
            text: this.ctx.text('Orange'),
          },
        };
        await this.setLabels({ labels, user });
      }
      return labels;
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
