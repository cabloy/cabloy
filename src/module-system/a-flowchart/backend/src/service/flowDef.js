module.exports = class FlowDef {
  async normalizeAssignees({ host, assignees, user }) {
    // check right
    assignees = await this.__checkRightNormalizeAssignees({ host, assignees, user });
    if (!assignees) this.ctx.throw(403);
    //  normalize
    return await this.ctx.bean.flow.normalizeAssignees(assignees);
  }

  async userSelect({ host, params, user }) {
    // check write right
    const rightWrite = await this.__checkRightWrite({ host, user });
    if (!rightWrite) this.ctx.throw(403);
    // users
    return await this.ctx.bean.user.selectGeneral({ params, user });
  }

  async __checkRightWrite({ host, user }) {
    const { flowDefId } = host;
    return await this.ctx.bean.atom.checkRightAction({
      atom: { id: flowDefId },
      action: 3,
      stage: 'draft',
      user,
      checkFlow: true,
    });
  }

  async __checkRightRead({ host, user }) {
    const { flowDefId } = host;
    return await this.ctx.bean.atom.checkRightRead({
      atom: { id: flowDefId },
      user,
      checkFlow: true,
    });
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
};
