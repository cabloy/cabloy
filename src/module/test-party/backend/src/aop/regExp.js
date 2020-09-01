module.exports = ctx => {
  class regExpAop {

    actionSync({ a, b }) {
      return a + b;
    }

    async actionAsync({ a, b }) {
      return Promise.resolve(a + b);
    }


  }

  return regExpAop;
};
