module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    get modelCondition() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeStartEventAtomCondition;
    }

    async deploy({ deploy, flowDefId, node }) {
      if (deploy) {
        await this._addCondition({ flowDefId, node });
      } else {
        // donot delete condition
      }
    }

    async _addCondition({ flowDefId, node }) {
      const atom = node.options && node.options.atom;
      if (!atom) throw new Error(`atom not set for startEventAtom: ${flowDefId}.${node.id}`);
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
        flowDefId, startEventId,
      });
      if (_condition) {
        // update
        _condition.atomClassId = atomClass.id;
        _condition.conditionExpression = conditionExpression;
        await this.modelCondition.update(_condition);
      } else {
        // insert
        await this.modelCondition.insert({
          flowDefId, startEventId,
          atomClassId: atomClass.id, conditionExpression,
        });
      }
    }

    async _runSchedule(context) {
      const { flowDefId, node } = context.data;
      // ignore on test
      if (ctx.app.meta.isTest) return;
      // check if valid
      if (!(await this._checkJobValid(context))) {
        await this._deleteSchedule(context);
        return;
      }
      // bean/parameterExpression
      const bean = node.options && node.options.bean;
      const parameterExpression = node.options && node.options.parameterExpression;
      if (bean) {
        // bean
        const parameter = ctx.bean.flow.evaluateExpression({
          expression: parameterExpression, globals: null,
        });
        await ctx.bean.flow.executeService({
          bean,
          parameter: { flowDefId, node, parameter },
          globals: null,
        });
      } else {
        // start
        await ctx.bean.flow.startById({ flowDefId, startEventId: node.id });
      }
    }

    async _checkJobValid(context) {
      const job = context.job;
      const { flowDefId, node } = context.data;
      // flowDef
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) return false;
      // disabled
      if (flowDef.disabled) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === node.id);
      if (!nodeConfig) return false;
      // check if changed
      const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const jobKeyConfig = getRepeatKey(flowDefId, nodeConfig.options && nodeConfig.options.repeat);
      if (jobKeyActive !== jobKeyConfig) return false;
      // ok
      return true;
    }

    async _deleteSchedule(context) {
      const job = context.job;
      const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const repeat = await job.queue.repeat;
      await repeat.removeRepeatableByKey(jobKeyActive);
    }

  }

  return FlowNode;
};

