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
    async _loopNodes({ content, nodeIdStart, fn, options }) {
      options = options || {};
      const checkNodeStart = options.checkNodeStart !== false;
      const nodes = [];
      const nodeIdCaches = {};
      // check node start
      if (checkNodeStart) {
        const resCheck = await this._loopNodes_checkNode({ content, nodeId: nodeIdStart, nodes, nodeIdCaches, fn });
        if (resCheck === false) {
          return nodes; // break
        }
      }
      // next
      await this._loopNodes_next({ content, nodeId: nodeIdStart, nodes, nodeIdCaches, fn });
      // ok
      return nodes;
    }

    async _loopNodes_checkNode({ content, nodeId, nodes, nodeIdCaches, fn }) {
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
      return await fn({ nodes, node });
    }

    async _loopNodes_next({ content, nodeId, nodes, nodeIdCaches, fn }) {
      // edges
      const edges = content.process.edges.filter(item => {
        return item.source === nodeId && !nodeIdCaches[item.target];
      });
      // next
      for (const edge of edges) {
        const nodeIdTarget = edge.target;
        // check node
        let resCheck = await this._loopNodes_checkNode({ content, nodeId: nodeIdTarget, nodes, nodeIdCaches, fn });
        if (resCheck === false) {
          return false; // break
        }
        // next
        resCheck = await this._loopNodes_next({ content, nodeId: nodeIdTarget, nodes, nodeIdCaches, fn });
        if (resCheck === false) {
          return false; // break
        }
      }
    }
  }

  return FlowDef;
};
