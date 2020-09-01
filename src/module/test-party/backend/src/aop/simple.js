module.exports = ctx => {
  class simpleAop {

    get__name(context, next) {
      context.value = `${context.value}:simpleaop`;
      next();
    }

    actionSync({ a, b }) {
      return a + b;
    }

    async actionAsync({ a, b }) {
      return Promise.resolve(a + b);
    }


  }

  return simpleAop;
};
