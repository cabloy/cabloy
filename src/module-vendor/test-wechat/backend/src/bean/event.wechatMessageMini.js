module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const { beanProvider, message } = context.data;
      // message
      if (message.MsgType === 'text') {
        const text = `${ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`;
        await ctx.bean.wechat.mini[beanProvider.providerScene].sendText(message.FromUserName, text);
        // break
        return;
      }
      // next
      await next();
    }
  }

  return eventBean;
};
