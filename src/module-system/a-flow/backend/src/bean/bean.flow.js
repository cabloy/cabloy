const vm = require('vm');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {

    get modelFlow() {
      return ctx.model.module(moduleInfo.relativeName).flow;
    }

    get modelFlowNode() {
      return ctx.model.module(moduleInfo.relativeName).flowNode;
    }

    async startByKey({ flowDefKey, flowAtomId, flowVars, flowUserId, startEventId }) {
      // fullKey
      const { fullKey } = ctx.bean.flowDef._combineFullKey({ flowDefKey });
      // get flow def
      const flowDef = await ctx.bean.flowDef.getByKey({ flowDefKey });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      if (flowDef.disabled) ctx.throw.module(moduleInfo.relativeName, 1002, fullKey);
      return await this._start({ flowDef, flowAtomId, flowVars, flowUserId, startEventId });
    }

    async startById({ flowDefId, flowAtomId, flowVars, flowUserId, startEventId }) {
      // get flow def
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flowDefId);
      if (flowDef.disabled) ctx.throw.module(moduleInfo.relativeName, 1002, flowDef.flowDefKey);
      return await this._start({ flowDef, flowAtomId, flowVars, flowUserId, startEventId });
    }

    evaluateExpression({ expression, globals }) {
      return vm.runInContext(expression, vm.createContext(globals || {}));
    }

    async executeService({ bean, parameterExpression, parameter, globals }) {
      if (parameterExpression !== undefined) {
        parameter = this.evaluateExpression({ expression: parameterExpression, globals });
      }
      return await this._executeServiceInner({ bean, parameter, globals });
    }

    async _executeServiceInner({ bean, parameter, globals }) {
      // bean
      const beanFullName = `${bean.module}.flow.service.${bean.name}`;
      const beanInstance = ctx.bean._getBean(beanFullName);
      if (!beanInstance) throw new Error(`bean not found: ${beanFullName}`);
      if (Object.getPrototypeOf(Object.getPrototypeOf(beanInstance)).constructor.name !== 'FlowServiceBase') {
        throw new Error(`bean should extends FlowServiceBase: ${beanFullName}`);
      }
      // context
      const context = Object.assign({ }, globals);
      if (parameter !== undefined) {
        context.parameter = parameter;
      }
      return await beanInstance.execute(context);
    }

    async _start({ flowDef, flowAtomId, flowVars, flowUserId, startEventId }) {
      // flowInstance
      const flowInstance = this._createFlowInstance({ flowDef });
      // start
      await flowInstance.start({ flowAtomId, flowVars, flowUserId, startEventId });
      // ok
      return flowInstance;
    }

    async _loadFlowInstance({ flowId }) {
      // flow
      const flow = await this.modelFlow.get({ id: flowId });
      if (!flow) ctx.throw.module(moduleInfo.relativeName, 1003, flowId);
      // flowDef: by key+version
      const flowDef = await ctx.bean.flowDef.getByKeyAndVersion({ flowDefKey: flow.flowDefKey, version: flow.version });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flow.flowDefId);
      // not check disabled
      // flowInstance
      const flowInstance = this._createFlowInstance({ flowDef });
      // load
      await flowInstance._load({ flow });
      // ok
      return flowInstance;
    }

    _createFlowInstance({ flowDef }) {
      const flowInstance = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.flow`, {
        flowDef,
      });
      return flowInstance;
    }

    async _loadFlowNodeInstance({ flowNodeId }) {
      // get
      const flowNode = await this.modelFlowNode.get({ id: flowNodeId });
      if (!flowNode) ctx.throw.module(moduleInfo.relativeName, 1004, flowNodeId);
      // load flow
      const flowInstance = await this._loadFlowInstance({ flowId: flowNode.flowId });
      // load flow node
      const flowNodeInstance = await flowInstance._loadNodeInstance({ flowNode });
      return flowNodeInstance;
    }

  }

  return Flow;
};
