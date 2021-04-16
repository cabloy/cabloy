module.exports = app => {

  class FlowDef extends app.Service {

    async normalizeAssignees({ host, assignees, user }) {
      // check right
      assignees = await this.__checkRightNormalizeAssignees({ host, assignees, user });
      if (!assignees) this.ctx.throw(403);
      //  normalize
      return await this.ctx.bean.flow.normalizeAssignees(assignees);
    }

    async __checkRightNormalizeAssignees({ host, assignees, user }) {
      const { flowDefId, nodeDefId } = host;
      // check write right
      const rightWrite = await this.ctx.bean.atom.checkRightAction({
        atom: { id: flowDefId },
        action: 3,
        stage: 'draft',
        user,
        checkFlow: true,
      });
      if (rightWrite) return assignees;
      // check read right
      const rightRead = await this.ctx.bean.atom.checkRightRead({
        atom: { id: flowDefId },
        user,
        checkFlow: true,
      });
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
      return node.options.assignees;
    }

  }
  return FlowDef;
};

