module.exports = app => {

  class FlowDef extends app.Service {

    async normalizeAssignees({ host, assignees, user }) {
      // check right
      assignees = await this.__checkRightNormalizeAssignees({ host, assignees, user });
      if (!assignees) this.ctx.throw(403);
      //  normalize
      return await this.ctx.bean.flow.normalizeAssignees(assignees);
    }

    async roleChildren({ host, params, user }) {
      // check write right
      const rightWrite = await this.__checkRightWrite({ host, user });
      if (!rightWrite) this.ctx.throw(403);
      // roles
      const { roleId, page } = params;
      return await this.ctx.bean.role.children({ roleId, page });
    }

    async userSelect({ host, params, user }) {
      // check write right
      const rightWrite = await this.__checkRightWrite({ host, user });
      if (!rightWrite) this.ctx.throw(403);
      // users
      const { query, page } = params;
      return await this.ctx.bean.user.select({
        options: {
          where: {
            'a.anonymous': 0,
            'a.disabled': 0,
            __or__: [
              { 'a.userName': { op: 'like', val: query } },
              { 'a.realName': { op: 'like', val: query } },
              { 'a.mobile': { op: 'like', val: query } },
            ],
          },
          orders: [['a.userName', 'asc']],
          page,
          removePrivacy: true,
        },
      });
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

  }
  return FlowDef;
};

