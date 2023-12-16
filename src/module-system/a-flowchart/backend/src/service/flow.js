module.exports = class Flow {
  async flowChartProcess({ host, user }) {
    // check right
    const flowChartProcess = await this.__checkRightFlowChartProcess({ host, user });
    if (!flowChartProcess) this.ctx.throw(403);
    // filter options / locale
    if (flowChartProcess.nodes) {
      flowChartProcess.nodes = flowChartProcess.nodes.map(node => {
        return {
          ...node,
          options: undefined,
          nameLocale: this.ctx.text(node.name),
        };
      });
    }
    if (flowChartProcess.edges) {
      flowChartProcess.edges = flowChartProcess.edges.map(edge => {
        return {
          ...edge,
          options: undefined,
        };
      });
    }
    // ok
    return flowChartProcess;
  }

  async __checkRightFlowChartProcess({ host, user }) {
    const { flowId } = host;
    // check right: allowViewWorkflow
    const allowViewWorkflow = await this.ctx.bean.flowTask._checkViewWorkflow({ flowId, user });
    if (!allowViewWorkflow) return null;
    // get flow
    const flow = await this.ctx.bean.flow.modelFlowHistory.get({ flowId });
    if (!flow) return null;
    // flowDef
    const flowDef = await this.ctx.bean.flowDef.getByKeyAndRevision({
      flowDefKey: flow.flowDefKey,
      flowDefRevision: flow.flowDefRevision,
    });
    if (!flowDef) return null;
    // content
    const content = flowDef.content ? JSON.parse(flowDef.content) : null;
    if (!content) return null;
    // ok
    return content.process;
  }
};
