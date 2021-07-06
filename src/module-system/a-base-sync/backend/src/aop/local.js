module.exports = ctx => {
  class localAop {
    // magic
    get__magic__(context, next) {
      next();
      const prop = context.prop;
      const moduleName = context.target.moduleName;
      if (context.value === undefined) {
        context.value = ctx.bean._getBean(moduleName, `local.${prop}`);
      }
    }
  }

  return localAop;
};
