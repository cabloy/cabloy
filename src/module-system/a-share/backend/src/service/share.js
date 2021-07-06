module.exports = app => {
  class Share extends app.Service {
    async generate({ host, atomId, url, user }) {
      return await this.ctx.bean.share.generate({ host, atomId, url, user });
    }

    async shareGo({ uuid, user }) {
      return await this.ctx.bean.share.shareGo({ uuid, user });
    }
  }

  return Share;
};
