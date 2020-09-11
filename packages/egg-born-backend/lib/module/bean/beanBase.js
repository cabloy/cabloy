class BeanBase {

  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
  }
}

module.exports = BeanBase;
