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
    _findNodes({ content, nodeStart, fn }) {
      const nodes = [];
      const nodeIdCaches = {};
      // next
      this._findNodes_next({ content, node: nodeStart, nodes, nodeIdCaches, fn });
      // ok
      return nodes;
    }

    _findNodes_next({ content, node, nodes, nodeIdCaches, fn }) {
      // cache
      nodeIdCaches[node.id] = true;
      // check node
      const resCheck = fn({ nodes, node });
      if (resCheck === false) {
        // break;
        return false; // break
      }
      // edges
      const edges = content.process.edges.filter(item => {
        return item.source === node.id && !nodeIdCaches[item.target];
      });
      // next
      for (const edge of edges) {
        const nodeTarget = this._findNode({ content, nodeDefId: edge.target });
        if (!nodeTarget) {
          throw new Error(`flow node not found: ${edge.target}`);
        }
        // next
        const resCheck = this._findNodes_next({ content, node: nodeTarget, nodes, nodeIdCaches, fn });
        if (resCheck === false) {
          // break;
          return false; // break
        }
      }
    }
  }

  return FlowDef;
};
