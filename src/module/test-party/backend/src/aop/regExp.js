module.exports = ctx => {
  class regExpAop {

    get__name(context, next) {
      context.value = `${context.value}:regexpaop`;
      next();
    }

    actionSync({ a, b }) {
      return a + b;
    }

    async actionAsync({ a, b }) {
      return Promise.resolve(a + b);
    }


  }

  return regExpAop;
};
