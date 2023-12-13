module.exports = ctx => {
  const moduleInfo = module.info;
  class Flow {
    async _loadFlowInstance({ flowId, history, throwError = true }) {
      // flow
      let flow;
      if (!history) {
        flow = await this.modelFlow.get({ id: flowId });
      } else {
        flow = await this.modelFlowHistory.get({ flowId });
        if (flow) {
          flow.id = flowId;
        }
      }
      if (!flow) {
        if (throwError) {
          ctx.throw.module(moduleInfo.relativeName, 1003, flowId);
        } else {
          return null;
        }
      }
      // flowDef: by key+revision
      const flowDef = await ctx.bean.flowDef.getByKeyAndRevision({
        flowDefKey: flow.flowDefKey,
        flowDefRevision: flow.flowDefRevision,
      });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flow.flowDefId);
      // not check atomDisabled
      // flowInstance
      const flowInstance = this._createFlowInstance({ flowDef });
      // load
      await flowInstance._load({ flow, history });
      // ok
      return flowInstance;
    }

    async _loadFlowNodeInstance({ flowNodeId, history, throwError = true }) {
      // get
      let flowNode;
      if (!history) {
        flowNode = await this.modelFlowNode.get({ id: flowNodeId });
      } else {
        flowNode = await this.modelFlowNodeHistory.get({ flowNodeId });
        if (flowNode) {
          flowNode.id = flowNodeId;
        }
      }
      if (!flowNode) {
        if (throwError) {
          ctx.throw.module(moduleInfo.relativeName, 1004, flowNodeId);
        } else {
          return null;
        }
      }
      // load flow
      const flowInstance = await this._loadFlowInstance({ flowId: flowNode.flowId, history });
      // load flow node
      const flowNodeInstance = await flowInstance._loadNodeInstance({ flowNode, history });
      return flowNodeInstance;
    }
  }

  return Flow;
};
