const FlowNodeActivityUserTaskBase = require('../common/flowNodeActivityUserTaskBase.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends FlowNodeActivityUserTaskBase(ctx) {
    get modelCondition() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeStartEventAtomCondition;
    }

    async deploy({ deploy, flowDefId, node }) {
      if (deploy) {
        await this._addCondition({ flowDefId, node });
      } else {
        await this._deleteCondition2({ flowDefId, node });
      }
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();
      // auto handle
      await this._autoHandle();
      // break
      return false;
    }

    async _autoHandle() {
      const flowId = this.context._flowId;
      // select
      const tasks = await ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'a.flowTaskStatus': 0,
          },
          history: 0,
        },
      });
      const task = tasks[0];
      const flowTaskId = task.id;
      const user = { id: task.userIdAssignee };
      // complete automatically only on first-in
      if (this.contextNode._flowNode.flowNodeIdPrev === 0) {
        //  claim automatically
        await ctx.bean.flowTask.claim({ flowTaskId, user });
        await ctx.bean.flowTask.complete({
          flowTaskId,
          handle: { status: 1 },
          user,
        });
      }
    }

    async _addCondition({ flowDefId, node }) {
      const atom = node.options && node.options.atom;
      if (!atom || !atom.module || !atom.atomClassName) {
        // donot delete condition
        // throw error
        throw new Error(`atom not set for startEventAtom: ${flowDefId}.${node.id}`);
      }
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({
        module: atom.module,
        atomClassName: atom.atomClassName,
        atomClassIdParent: atom.atomClassIdParent || 0,
      });
      const conditionExpression = node.options.conditionExpression;
      // get condition
      const startEventId = node.id;
      const _condition = await this.modelCondition.get({
        flowDefId,
        startEventId,
      });
      if (_condition) {
        // update
        _condition.atomClassId = atomClass.id;
        _condition.conditionExpression = conditionExpression;
        await this.modelCondition.update(_condition);
      } else {
        // insert
        await this.modelCondition.insert({
          flowDefId,
          startEventId,
          atomClassId: atomClass.id,
          conditionExpression,
        });
      }
    }

    async _match({ atom, userId }) {
      // order by atomStatic/conditionExpression
      const list = await ctx.model.query(
        `
          select a.* from aFlowNodeStartEventAtomCondition a
            left join aFlowDef b on a.flowDefId=b.id
            left join aAtom c on b.atomId=c.id
            where a.iid=? and a.atomClassId=?
            order by c.atomStatic asc, a.conditionExpression desc
        `,
        [ctx.instance.id, atom.atomClassId]
      );
      for (const _condition of list) {
        const flowInstance = await this._matchCondition({ _condition, atom, userId });
        if (flowInstance) return flowInstance;
      }
      return null;
    }

    async _matchCondition(context) {
      const { _condition, atom, userId } = context;
      // check if valid
      if (!(await this._checkConditionValid(context))) {
        await this._deleteCondition(context);
        return null;
      }
      // match conditionExpression
      const conditionActive = _condition.conditionExpression;
      if (conditionActive) {
        const res = ctx.bean.flow.evaluateExpression({
          expression: conditionActive,
          globals: { atom },
        });
        if (!res) return null;
      }
      // start
      const flowInstance = await ctx.bean.flow.startById({
        flowDefId: _condition.flowDefId,
        startEventId: _condition.startEventId,
        flowUserId: userId,
        flowAtomId: atom.atomId,
      });
      // ok
      return flowInstance;
    }

    async _checkConditionValid(context) {
      const { _condition } = context;
      // flowDef
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId: _condition.flowDefId });
      if (!flowDef) return false;
      // atomDisabled
      if (flowDef.atomDisabled === 1) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === _condition.startEventId);
      if (!nodeConfig) return false;
      // check if changed
      const conditionActive = _condition.conditionExpression;
      const conditionConfig = nodeConfig.options && nodeConfig.options.conditionExpression;
      if (conditionActive !== conditionConfig) return false;
      // ok
      return true;
    }

    async _deleteCondition(context) {
      const { _condition } = context;
      await this.modelCondition.delete({ id: _condition.id });
    }

    async _deleteCondition2({ flowDefId, node }) {
      const startEventId = node.id;
      await this.modelCondition.delete({
        flowDefId,
        startEventId,
      });
    }
  }

  return FlowNode;
};
