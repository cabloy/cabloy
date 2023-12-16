const moduleInfo = module.info;
module.exports = class eventBean {
  get modelAuthOpen() {
    return this.ctx.model.module(moduleInfo.relativeName).authOpen;
  }
  async execute(context, next) {
    const data = context.data;
    // delete aAuthOpen/aAuth
    const items = await this.modelAuthOpen.select({
      where: { userId: data.userIdFrom },
    });
    for (const item of items) {
      await this.ctx.bean.atom.delete({ key: { atomId: item.atomId } });
    }
    // next
    await next();
  }
};
