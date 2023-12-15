const moduleInfo = module.info;
module.exports = class Stats {
  async execute(context) {
    const { user } = context;
    // user stats
    const statsUser = await this.ctx.bean.stats._get({
      module: moduleInfo.relativeName,
      fullName: 'user',
      user,
    });
    // message stats
    const statsMessage = await this.ctx.bean.stats._get({
      module: 'a-message',
      fullName: 'message',
      user,
    });
    // minus
    if (statsMessage) {
      if (statsMessage.red !== undefined) {
        statsUser.red -= statsMessage.red;
      }
      if (statsMessage.orange !== undefined) {
        statsUser.orange -= statsMessage.orange;
      }
    }
    // ok
    return statsUser;
  }
};
