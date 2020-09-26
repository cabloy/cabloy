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
        await this._removeSchedule({ flowDefId, node });
      }
    }

    async _runSchedule(context) {
      const { flowDefId, node } = context.data;
      // ignore on test
      if (ctx.app.meta.isTest) return;
      // check if valid
      if (!this._checkJobValid(context)) {
        await this._deleteSchedule(context);
        return;
      }
      // expression
      let flowVars;
      let flowUserId;
      const flowVarsExpression = node.options && node.options.flowVarsExpression;

      // start
      await ctx.bean.flow.startById({ flowDefId, flowVars, flowUserId });
      // schedule
      const fullKey = `${module}.${name}`;
      const schedule = ebSchedules[fullKey];
      // bean
      const bean = schedule.bean;
      // execute
      return await loader.app.meta.util.executeBean({
        subdomain,
        beanModule: bean.module,
        beanFullName: `${bean.module}.schedule.${bean.name}`,
        transaction: schedule.config.transaction,
        context,
      });
    }

    async _addSchedule({ flowDefId, node }) {
      const repeat = node.options && node.options.repeat;
      if (!repeat) return;
      // push
      const jobName = flowDefId;
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

    async _deleteSchedule({ flowDefId, node }) {

    }

  }

  return FlowNode;
};

