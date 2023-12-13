module.exports = ctx => {
  const moduleInfo = module.info;
  class eventBean {
    get modelAuthOpen() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
    }
    async execute(context, next) {
      const data = context.data;
      // delete aAuthOpen/aAuth
      const items = await this.modelAuthOpen.select({
        where: { userId: data.userIdFrom },
      });
      for (const item of items) {
        await ctx.bean.atom.delete({ key: { atomId: item.atomId } });
      }
      // next
      await next();
    }
  }

  return eventBean;
};
