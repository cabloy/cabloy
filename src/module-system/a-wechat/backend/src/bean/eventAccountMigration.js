module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      // aWechatUser
      await ctx.model.query(
        'update aWechatUser a set a.userId=? where a.iid=? and a.userId=?',
        [ data.userIdTo, ctx.instance.id, data.userIdFrom ]
      );
      // next
      await next();
    }

  }

  return eventBean;
};
