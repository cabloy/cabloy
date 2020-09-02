module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      data.text = 'hello echo';
      context.result = 'returnValue';
      // break
      return;
    }

  }

  return eventBean;
};
