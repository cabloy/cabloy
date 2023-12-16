const moduleInfo = module.info;

module.exports = class eventBean {
  async execute(context, next) {
    const data = context.data;
    // provider
    const providerItem = await this.ctx.bean.authProvider.getAuthProvider({
      module: moduleInfo.relativeName,
      providerName: 'authsms',
    });
    // model auth
    const modelAuth = this.ctx.model.module('a-base').auth;
    // need not providerScene
    const authItem = await modelAuth.get({ userId: data.userIdFrom, providerId: providerItem.id });
    if (authItem) {
      const user = { id: data.userIdTo, mobile: authItem.profileId };
      await this.ctx.bean.user.save({ user });
    }
    // next
    await next();
  }
};
