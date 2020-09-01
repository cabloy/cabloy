module.exports = ctx => {
  class regExpAop {

    get__name(context, next) {
      next();
      context.value = `${context.value}:regexpaop`;
    }

    set__name(context, next) {
      const parts = context.value.split(':');
      const index = parts.indexOf('regexpaop');
      if (index > -1) {
        parts.splice(index, 1);
      }
      context.value = parts.join(':');
      next();
    }

    actionSync(context, next) {
      next();
      context.result = `${context.result}:regexpaop`;
    }

    async actionAsync(context, next) {
      await next();
      context.result = `${context.result}:regexpaop`;
    }

  }

  return regExpAop;
};
