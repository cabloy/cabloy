const debug = require('debug')('flow');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowInstance {
    // return true, means has one edge to be taken
    async nextEdges({ contextNode, behaviorDefId }) {
      const edgeInstances = await this._findEdgeInstancesNext({
        nodeDefId: contextNode._nodeDef.id,
        contextNode,
        behaviorDefId,
      });
      if (edgeInstances.length === 0) return false;
      for (const edgeInstance of edgeInstances) {
        // check if end
        if (this.context._flow.flowStatus !== this.constant.flow.status.flowing) {
          ctx.throw.module(moduleInfo.relativeName, 1008, this.context._flowId);
        }
        // enter
        const res = await edgeInstance.enter();
        if (res) {
          return true;
        }
      }
      // need not throw exception, should be handled by the admin user
      return false;
      // // should throw exception
      // ctx.throw.module(moduleInfo.relativeName, 1010, contextNode._flowNodeId);
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
