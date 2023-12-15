const moduleInfo = module.info;
module.exports = class Stats {
  async execute(context) {
    const { user } = context;
    const modelFlow = this.ctx.model.module(moduleInfo).flow;
    const count = await modelFlow.count({
      flowUserId: user.id,
    });
    return count;
  }
};
