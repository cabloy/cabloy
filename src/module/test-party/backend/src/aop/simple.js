module.exports = ctx => {
  class simpleAop {

    actionSync({ a, b }) {
      return a + b;
    }

    async actionAsync({ a, b }) {
      return Promise.resolve(a + b);
    }


  }

  return simpleAop;
};
