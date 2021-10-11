module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    async enter(context, next) {
      // addJob
      await this._addJob();
      return await next();
    }

    async _addJob() {
      const flowId = this.context._flowId;
      const flowNodeId = this.contextNode._flowNodeId;
      const behaviorDefId = this._behaviorDef.id;
      const options = this.nodeInstance.getBehaviorDefOptions({ behaviorDefId });
      if (!options.timeDuration && !options.timeDate) {
        // do nothing
        return;
      }
      // delay
      let delay;
      if (options.timeDuration) {
        delay = options.timeDuration;
      } else {
        delay = options.timeDate - new Date();
      }
      // push
      const jobName = this._getJobName(flowId, flowNodeId, behaviorDefId);
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'overtime',
        queueNameSub: flowId,
        jobName,
        jobOptions: {
          delay,
        },
        data: {
          flowId,
          flowNodeId,
          behaviorDefId,
        },
      });
    }

    async _runJob(context) {
      console.log('----runDelayedTask', context);
    }

    _getJobName(flowId, flowNodeId, behaviorDefId) {
      return `${flowId}.${flowNodeId}.${behaviorDefId}`.replace(/:/g, '.');
    }
  }

  return FlowBehavior;
};
