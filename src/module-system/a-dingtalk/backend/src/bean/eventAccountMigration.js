module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      // aDingtalkMember
      await ctx.model.query(
        'update aDingtalkMember a set a.userId=? where a.iid=? and a.userId=?',
        [ data.userIdTo, ctx.instance.id, data.userIdFrom ]
      );
      // next
      await next();
    }

  }

  return eventBean;
};
