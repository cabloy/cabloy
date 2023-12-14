module.exports = class FlowNode extends module.meta.class.FlowNodeBase {
  async onNodeDoing() {
    // super
    await super.onNodeDoing();
    // bean/parameters
    const bean = this.contextNode._nodeDef.options.bean;
    const parameterExpression = this.contextNode._nodeDef.options.parameterExpression;
    // check
    if (!bean) {
      throw new Error(
        `flow service bean is not set: flow:${this.context._flowDef.atomName}, node:${this.contextNode._nodeDef.name}`
      );
    }
    // executeService
    await this.ctx.bean.flow.executeService({
      bean,
      parameterExpression,
      globals: {
        context: this.context,
        contextNode: this.contextNode,
      },
    });
    // ok
    return true;
  }
};
