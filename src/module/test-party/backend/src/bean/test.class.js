class classBeanBase {

  constructor(ctx) {
    this.ctx = ctx;
  }

  actionSync({ a, b }) {
    return a + b;
  }

}

class classBean extends classBeanBase {

  async actionAsync({ a, b }) {
    return Promise.resolve(a + b);
  }

}

module.exports = classBean;
