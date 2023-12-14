const moduleInfo = module.info;
module.exports = class FlowNode extends module.meta.class.FlowNodeBase {
  async deploy({ deploy, flowDefId, node }) {
    if (deploy) {
      await this._addSchedule({ flowDefId, node });
    } else {
      await this._deleteSchedule2({ flowDefId, node });
    }
  }

  async _addSchedule({ flowDefId, node }) {
    const repeat = this._getJobRepeat(node);
    if (!repeat) return;
    if (!repeat.every && !repeat.cron) return;
    // push
    const jobName = this._getJobName(flowDefId, node);
    this.ctx.meta.util.queuePush({
      module: moduleInfo.relativeName,
      queueName: 'startEventTimer',
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
    if (this.ctx.app.meta.isTest) return;
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
      const parameter = this.ctx.bean.flow.evaluateExpression({
        expression: parameterExpression,
        globals: null,
      });
      await this.ctx.bean.flow.executeService({
        bean,
        parameter: { flowDefId, node, parameter },
        globals: null,
      });
    } else {
      // start
      await this.ctx.bean.flow.startById({ flowDefId, startEventId: node.id });
    }
  }

  async _checkJobValid(context) {
    const job = context.job;
    const { flowDefId, node } = context.data;
    // flowDef
    const flowDef = await this.ctx.bean.flowDef.getById({ flowDefId });
    if (!flowDef) return false;
    // atomDisabled
    if (flowDef.atomDisabled === 1) return false;
    // content
    const content = flowDef.content ? JSON.parse(flowDef.content) : null;
    if (!content) return false;
    const nodeConfig = content.process.nodes.find(item => item.id === node.id);
    if (!nodeConfig) return false;
    // check if changed
    const jobKeyActive = this.ctx.app.meta.queue._getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
    const jobKeyConfig = this.ctx.app.meta.queue._getRepeatKey(
      this._getJobName(flowDefId, nodeConfig),
      this._getJobRepeat(nodeConfig)
    );
    if (jobKeyActive !== jobKeyConfig) return false;
    // ok
    return true;
  }

  async _deleteSchedule(context) {
    const job = context.job;
    const jobKeyActive = this.ctx.app.meta.queue._getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
    const repeat = await job.queue.repeat;
    await repeat.removeRepeatableByKey(jobKeyActive);
  }

  async _deleteSchedule2({ flowDefId, node }) {
    const jobKeyActive = this.ctx.app.meta.queue._getRepeatKey(
      this._getJobName(flowDefId, node),
      this._getJobRepeat(node)
    );
    const queue = this.ctx.app.meta.queue._getQueue({
      subdomain: this.ctx.subdomain,
      module: moduleInfo.relativeName,
      queueName: 'startEventTimer',
    });
    const repeat = await queue.repeat;
    await repeat.removeRepeatableByKey(jobKeyActive);
  }

  _getJobName(flowDefId, node) {
    return `${flowDefId}.${node.id}`.replace(/:/g, '.');
  }
  _getJobRepeat(node) {
    return node.options && node.options.repeat;
  }
};
