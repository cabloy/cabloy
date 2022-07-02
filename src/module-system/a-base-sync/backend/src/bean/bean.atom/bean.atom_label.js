module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async labels({ key, atom: { labels = null }, user }) {
      // get
      const atom = await this.get({ atomId: key.atomId });
      if (atom.atomStage !== 1) ctx.throw.module(moduleInfo.relativeName, 1010);
      // labels

      // force delete
      await this.modelAtomLabel.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      await this.modelAtomLabelRef.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      // new
      if (labels && labels.length > 0) {
        await this.modelAtomLabel.insert({
          userId: user.id,
          atomId: key.atomId,
          labels: JSON.stringify(labels),
        });
        for (const labelId of labels) {
          await this.modelAtomLabelRef.insert({
            userId: user.id,
            atomId: key.atomId,
            labelId,
          });
        }
      }
      // notify
      this._notifyLabels();
    }

    async _labels_atomLabel({ atomId, labels, user }) {
      //
      const res = await this.modelAtomLabel.get({
        userId: user.id,
        atomId,
      });
    }

    async getLabels({ user }) {
      const data = await this.modelLabel.get({
        userId: user.id,
      });
      let labels = data ? JSON.parse(data.labels) : null;
      if (!labels || Object.keys(labels).length === 0) {
        // append default labels
        labels = {
          1: {
            color: 'red',
            text: ctx.text('Red'),
          },
          2: {
            color: 'orange',
            text: ctx.text('Orange'),
          },
        };
        await this.setLabels({ labels, user });
      }
      return labels;
    }

    async setLabels({ labels, user }) {
      const labels2 = JSON.stringify(labels);
      const res = await this.modelLabel.get({
        userId: user.id,
      });
      if (!res) {
        await this.modelLabel.insert({
          userId: user.id,
          labels: labels2,
        });
      } else {
        await this.modelLabel.update({
          id: res.id,
          labels: labels2,
        });
      }
    }
  }
  return Atom;
};
