module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const data = context.data;
      // providerScene
      const providerScene = data.providerScene;
      // message
      const message = data.message;
      if (message.MsgType === 'text') {
        const text = `${ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`;
        await ctx.bean.wechat.mini[providerScene].sendText(message.FromUserName, text);
        // break
        return;
      }
      // next
      await next();
    }
  }

  return eventBean;
};
