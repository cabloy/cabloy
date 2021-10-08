module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async deploy({ deploy, flowDefId, node }) {
      if (deploy) {
        await this._addSchedule({ flowDefId, node });
      } else {
        // donot delete schedule
      }
    }

    async _addSchedule({ flowDefId, node }) {
      const repeat = node.options && node.options.repeat;
      if (!repeat) return;
      // push
      const jobName = `${flowDefId}.${node.id}`.replace(/:/g, '.');
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'startEventTimer',
        queueNameSub: flowDefId,
        jobName,
        jobOptions: {
          repeat,
        },
        data: {
          flowDefId,
          node,
        },
      });
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
          expression: parameterExpression,
          globals: null,
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
      // atomDisabled
      if (flowDef.atomDisabled === 1) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === node.id);
      if (!nodeConfig) return false;
      // check if changed
      const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const jobKeyConfig = getRepeatKey(
        `${flowDefId}.${nodeConfig.id}`,
        nodeConfig.options && nodeConfig.options.repeat
      );
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

function getRepeatKey(name, repeat) {
  const endDate = repeat.endDate ? new Date(repeat.endDate).getTime() : '';
  const tz = repeat.tz || '';
  const suffix = (repeat.cron ? repeat.cron : String(repeat.every)) || '';

  return `${name}::${endDate}:${tz}:${suffix}`;
}
