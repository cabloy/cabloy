module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const data = context.data;
      const modelAuthOpen = ctx.model.module(moduleInfo.relativeName).authOpen;
      // delete aAuthOpen/aAuth
      const items = await modelAuthOpen.select({ userId: data.userIdFrom });
      for (const item of items) {
        await ctx.bean.atom.delete({ key: { atomId: item.atomId } });
      }
      // next
      await next();
    }
  }

  return eventBean;
};
