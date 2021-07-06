class BeanBase {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx ? ctx.app : null;
  }
}

module.exports = BeanBase;
