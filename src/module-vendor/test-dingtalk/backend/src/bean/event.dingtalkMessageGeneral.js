module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const { message } = context.data;
      console.log('-------dingtalk callback, EventType: ', message.EventType);
      // next
      await next();
    }
  }

  return eventBean;
};
