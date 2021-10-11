module.exports = ctx => {
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    async enter(context, next) {
      // nodeDef
      // const nodeDef = this.contextNode._nodeDef;
      // const flowDefId=this.context.
      return await next();
    }

    async _addTask() {
      const repeat = this._getJobRepeat(node);
      if (!repeat) return;
      if (!repeat.every && !repeat.cron) return;
      // push
      const jobName = this._getJobName(flowDefId, node);
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

    async _runTask(context) {
      console.log('----runDelayedTask', context);
    }
  }

  return FlowBehavior;
};
