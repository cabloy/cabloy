module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    get modelWechatUser() {
      return ctx.model.module('a-wechat').wechatUser;
    }

    async execute(context, next) {
      const data = context.data;
      // aWechatUser
      await this.modelWechatUser.update(
        { userId: data.userIdTo },
        {
          where: {
            userId: data.userIdFrom,
          },
        }
      );
      // next
      await next();
    }
  }

  return eventBean;
};
