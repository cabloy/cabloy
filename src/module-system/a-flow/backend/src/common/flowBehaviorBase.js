module.exports = class FlowBehaviorBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.nodeInstance = options.nodeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
      this.contextEdge = options.contextEdge;
    }
  }

  // getNodeDefOptions(context, next) {
  //   return next();
  // }

  // async enter(context, next) {
  //   return await next();
  // }

  // async begin(context, next) {
  //   return await next();
  // }

  // async doing(context, next) {
  //   return await next();
  // }

  // async end(context, next) {
  //   return await next();
  // }

  // async leave(context, next) {
  //   return await next();
  // }

  // async clear(context, next) {
  //   return await next();
  // }
};
