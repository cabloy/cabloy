module.exports = class Message {
  async group({ options, user }) {
    return await this.ctx.bean.message.group({ options, user });
  }
};
