module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class EventBean {
    async execute(context, next) {
      const data = context.data;
      data.text = 'hello echo';
      context.result = `${context.result}.echo`;
      await next();
      context.result = `echo.${context.result}`;
    }
  }

  return EventBean;
};
