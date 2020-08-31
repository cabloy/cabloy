class appBean {

  constructor(ctx) {
    this.ctx = ctx;
  }

  actionSync({ a, b }) {
    return a + b;
  }

  async actionAsync({ a, b }) {
    return Promise.resolve(a + b);
  }

}

module.exports = appBean;
