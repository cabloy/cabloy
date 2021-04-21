module.exports = app => {

  class Flow extends app.Service {

    async flowChartProcess({ host, user }) {
      // check right
      const flowChartProcess = await this.__checkRightFlowChartProcess({ host, user });
      if (!flowChartProcess) this.ctx.throw(403);
      // filter/locale
      if (flowChartProcess.nodes) {
        flowChartProcess.nodes = flowChartProcess.nodes.map(node => {
          return {
            ... node,
            options: undefined,
            nameLocale: this.ctx.text(node.name),
          };
        });
      }
      if (flowChartProcess.edges) {
        flowChartProcess.edges = flowChartProcess.edges.map(edge => {
          return {
            ... edge,
            options: undefined,
          };
        });
      }
      // ok
      return flowChartProcess;
    }

    async __checkRightFlowChartProcess({ host, user }) {
      const { flowId } = host;
      // check right
      let flow = await this.ctx.bean.flow.get({ flowId, history: true, user });
      if (!flow) return null;
      // get flow
      flow = await this.ctx.bean.flow.modelFlowHistory.get({ flowId });
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

    async __checkRightNormalizeAssignees({ host, assignees, user }) {
      const { flowDefId, nodeDefId } = host;
      // check write right
      const rightWrite = await this.__checkRightWrite({ host, user });
      if (rightWrite) return assignees;
      // check read right
      const rightRead = await this.__checkRightRead({ host, user });
      // no right
      if (!rightRead) return null;
      // get assignees from flowDef
      const flowDef = await this.ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) return null;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return null;
      // find
      const node = content.process.nodes.find(item => item.id === nodeDefId);
      if (!node) return null;
      // ok
      return node.options.task ? node.options.task.assignees : node.options.assignees;
    }

  }
  return Flow;
};

