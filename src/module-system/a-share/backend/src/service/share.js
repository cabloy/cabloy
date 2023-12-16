module.exports = class Share {
  async generate({ host, atomId, url, user }) {
    return await this.ctx.bean.share.generate({ host, atomId, url, user });
  }

  async shareGo({ uuid, user }) {
    return await this.ctx.bean.share.shareGo({ uuid, user });
  }
};
