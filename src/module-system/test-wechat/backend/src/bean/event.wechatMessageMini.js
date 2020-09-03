module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      // scene
      const scene = data.scene;
      // message
      const message = data.message;
      if (message.MsgType === 'text') {
        const text = `${ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`;
        await ctx.meta.wechat.mini[scene].sendText(message.FromUserName, text);
        // break
        return;
      }
      // next
      await next();
    }

  }

  return eventBean;
};
