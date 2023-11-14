module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {
    _findNodeTasks({ content, nodeStart }) {
      const nodeTasks = [];
      const nodeIdCaches = {};
      // next
      this._findNodeTasks_next({ content, node: nodeStart, nodeTasks, nodeIdCaches });
      //
      return nodeTasks;
    }

    _findNodeTasks_next({ content, node, nodeTasks, nodeIdCaches }) {
      // cache
      nodeIdCaches[node.id] = true;
      // check if endEvent
      if (node.type.indexOf('endEvent') > -1) {
        return;
      }
      // check if activityUserTask
      if (node.type.indexOf('activityUserTask') > -1) {
        // check if auto
        let _vars = ctx.bean.util.getProperty(node, 'options.assignees.vars');
        if (_vars) {
          if (typeof _vars === 'string') {
            _vars = _vars.split(',');
          }
          if (_vars.includes('auto')) {
            nodeTasks.push(node);
          }
        }
      }
      // edges
      const edges = content.process.edges.filter(item => {
        return item.source === node.id && !nodeIdCaches[item.target];
      });
      // next
      for (const edge of edges) {
        const nodeTarget = content.process.nodes.find(item => {
          return item.id === edge.target;
        });
        if (!nodeTarget) {
          throw new Error(`flow node not found: ${edge.target}`);
        }
        // next
        this._findNodeTasks_next({ content, node: nodeTarget, nodeTasks, nodeIdCaches });
      }
    }
  }

  return FlowDef;
};
