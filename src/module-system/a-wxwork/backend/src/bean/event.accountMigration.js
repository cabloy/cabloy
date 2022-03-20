module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    get modelMember() {
      return ctx.model.module(moduleInfo.relativeName).member;
    }

    async execute(context, next) {
      const data = context.data;
      // aWxworkMember
      await this.modelMember.update(
        { userId: data.userIdTo },
        {
          where: { userId: data.userIdFrom },
        }
      );
      // next
      await next();
    }
  }

  return eventBean;
};
