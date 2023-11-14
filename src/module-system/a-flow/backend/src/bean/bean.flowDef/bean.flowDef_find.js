module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {
    _findNode({ content, nodeDefId }) {
      return content.process.nodes.find(node => {
        return node.id === nodeDefId;
      });
    }

    _findEdgesPrevious({ content, behaviorDefId, nodeDefId }) {
      return content.process.edges.filter(edge => {
        return edge.target === nodeDefId && (edge.behavior || '') === (behaviorDefId || '');
      });
    }

    _findEdgesNext({ content, behaviorDefId, nodeDefId }) {
      return content.process.edges.filter(edge => {
        return edge.source === nodeDefId && (edge.behavior || '') === (behaviorDefId || '');
      });
    }

    // fn: false is break
    async _loopNodes({ content, nodeIdStart, fn }) {
      const nodes = [];
      const nodeIdCaches = {};
      // next
      await this._loopNodes_next({ content, nodeId: nodeIdStart, nodes, nodeIdCaches, fn });
      // ok
      return nodes;
    }

    async _loopNodes_next({ content, nodeId, nodes, nodeIdCaches, fn }) {
      // cache
      if (nodeIdCaches[nodeId]) {
        return;
      }
      nodeIdCaches[nodeId] = true;
      // node
      const node = this._findNode({ content, nodeDefId: nodeId });
      if (!node) {
        throw new Error(`flow node not found: ${nodeId}`);
      }
      // check node
      const resCheck = await fn({ nodes, node });
      if (resCheck === false) {
        return false; // break
      }
      // edges
      const edges = content.process.edges.filter(item => {
        return item.source === node.id && !nodeIdCaches[item.target];
      });
      // next
      for (const edge of edges) {
        // next
        const resCheck = await this._loopNodes_next({ content, nodeId: edge.target, nodes, nodeIdCaches, fn });
        if (resCheck === false) {
          return false; // break
        }
      }
    }
  }

  return FlowDef;
};
