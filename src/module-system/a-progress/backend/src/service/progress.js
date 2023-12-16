module.exports = class Progress {
  async check({ progressId, counter, user }) {
    return await this.ctx.bean.progress.check({ progressId, counter, user });
  }

  async abort({ progressId, user }) {
    return await this.ctx.bean.progress.abort({ progressId, user });
  }

  async delete({ progressId, user }) {
    return await this.ctx.bean.progress.delete({ progressId, user });
  }
};
