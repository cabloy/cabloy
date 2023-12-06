module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowInstance {
    // return true, means has one edge to be taken
    async nextEdges({ nodeInstance, behaviorDefId }) {
      const contextNode = nodeInstance.contextNode;
      const nodeBase = nodeInstance.nodeBase;
      // gatewayMode
      const gatewayMode = nodeBase.options?.default?.__gatewayMode || 'exclusive';
      // edgeInstances
      const edgeInstances = await this._findEdgeInstancesNext({
        nodeDefId: contextNode._nodeDef.id,
        contextNode,
        behaviorDefId,
      });
      if (edgeInstances.length === 0) {
        // means no edges
        return false;
      }
      // loop
      let resBingo = false;
      for (const edgeInstance of edgeInstances) {
        // check if end
        if (this.context._flow.flowStatus !== this.constant.flow.status.flowing) {
          ctx.throw.module(moduleInfo.relativeName, 1008, this.context._flowId);
        }
        // enter
        const resEnter = await edgeInstance.enter();
        if (resEnter) {
          resBingo = true;
          if (gatewayMode === 'exclusive') {
            // only once
            break;
          }
        }
      }
      const debug = ctx.app.bean.debug.get('flow');
      debug(
        'nextEdges %s: flowId:%d, flowNodeId:%d',
        resBingo ? 'bingo' : 'invalid',
        this.context._flowId,
        contextNode._flowNodeId
      );
      // bingo
      if (resBingo) return true;
      // should throw exception
      //   should has a default edge(_calcConditionExpressionLevel===3), which is followed by endEventNone
      ctx.throw.module(moduleInfo.relativeName, 1010, contextNode._flowNodeId);
      // return false;
    }

    async _findEdgeInstancesNext({ nodeDefId, contextNode, behaviorDefId }) {
      // edgeDefs
      const edgeDefs = ctx.bean.flowDef._findEdgesNext({
        content: this.context._flowDefContent,
        behaviorDefId,
        nodeDefId,
      });
      // sort by conditionExpression
      edgeDefs.sort(function (a, b) {
        const levelA = ctx.bean.flowDef._calcConditionExpressionLevel({
          conditionExpression: a.options?.conditionExpression,
        });
        const levelB = ctx.bean.flowDef._calcConditionExpressionLevel({
          conditionExpression: b.options?.conditionExpression,
        });
        return levelA - levelB;
      });
      // edges
      const edges = [];
      for (const edgeDef of edgeDefs) {
        const edge = await this._createEdgeInstance({ edgeDef, contextNode });
        edges.push(edge);
      }
      return edges;
    }
  }

  return FlowInstance;
};
