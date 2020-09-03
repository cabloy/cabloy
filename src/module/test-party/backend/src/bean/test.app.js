module.exports = app => {

  class appBean extends app.meta.BeanBase {

    actionSync({ a, b }) {
      return a + b;
    }

    async actionAsync({ a, b }) {
      return Promise.resolve(a + b);
    }

  }

  return appBean;
};

