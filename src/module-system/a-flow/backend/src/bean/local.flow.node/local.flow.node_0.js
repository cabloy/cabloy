const VarsFn = require('../../common/vars.js');
const UtilsFn = require('../../common/utils.js');

const __behaviorBaseDef = {
  id: 'behavior_0',
  name: 'Base',
  type: 'base',
};
module.exports = ctx => {
  const moduleInfo = module.info;
  class FlowNode {
    // contextEdge maybe null
    constructor({ flowInstance, context, contextEdge, nodeDef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this.contextEdge = contextEdge;
      this._nodeBase = null;
      this._nodeBaseBean = null;
      this._behaviors = null;
      // context
      this.contextNode = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.node`, {
        context,
        contextEdge,
        nodeDef,
      });
    }

    get modelFlow() {
      return ctx.model.module(moduleInfo.relativeName).flow;
    }
    get modelFlowHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowHistory;
    }
    get modelFlowNode() {
      return ctx.model.module(moduleInfo.relativeName).flowNode;
    }
    get modelFlowNodeHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeHistory;
    }
    get behaviors() {
      if (!this._behaviors) {
        this._behaviors = this._prepareBehaviors();
      }
      return this._behaviors;
    }

    async init({ flowNodeIdPrev }) {
      // create flowNode
      const flowNodeId = await this._createFlowNode({ flowNodeIdPrev });
      // context init
      await this._contextInit({ flowNodeId });
    }

    async _load({ flowNode, history }) {
      // context init
      await this._contextInit({ flowNodeId: flowNode.id, history });
    }

    async _createFlowNode({ flowNodeIdPrev = 0 }) {
      // behaviorDefId
      const behaviorDefId = (this.contextEdge && this.contextEdge._edgeDef.behavior) || '';
      // flowNode
      const data = {
        flowId: this.context._flowId,
        flowNodeDefId: this.contextNode._nodeDef.id,
        flowNodeName: this.contextNode._nodeDef.name,
        flowNodeType: this.contextNode._nodeDef.type,
        flowNodeIdPrev,
        nodeVars: '{}',
        behaviorDefId,
      };
      const res = await this.modelFlowNode.insert(data);
      const flowNodeId = res.insertId;
      // flowNodeHistory
      data.flowNodeId = flowNodeId;
      await this.modelFlowNodeHistory.insert(data);
      // ok
      return flowNodeId;
    }

    async _contextInit({ flowNodeId, history }) {
      // flowNodeId
      this.contextNode._flowNodeId = flowNodeId;
      // flowNode
      if (!history) {
        this.contextNode._flowNode = await this.modelFlowNode.get({ id: flowNodeId });
      }
      this.contextNode._flowNodeHistory = await this.modelFlowNodeHistory.get({ flowNodeId });
      // nodeVars
      this.contextNode._nodeVars = new (VarsFn())();
      this.contextNode._nodeVars._vars = this.contextNode._flowNodeHistory.nodeVars
        ? JSON.parse(this.contextNode._flowNodeHistory.nodeVars)
        : {};
      // utils
      this.contextNode._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextEdge: this.contextEdge,
      });
    }

    _prepareBehaviors() {
      // nodeDef
      const nodeDef = this.contextNode._nodeDef;
      // behaviorsDef
      const behaviorsDef = nodeDef.behaviors || [];
      // behaviors
      const behaviors = behaviorsDef.map(behaviorDef => this._prepareBehavior(behaviorDef));
      // behavior base
      behaviors.push(this._prepareBehavior(__behaviorBaseDef));
      // ok
      return behaviors;
    }

    _prepareBehavior(behaviorDef) {
      const behaviorBase = ctx.bean.flowDef._getFlowBehaviorBase(behaviorDef.type);
      const behaviorBean = ctx.bean._newBean(behaviorBase.beanFullName, {
        flowInstance: this.flowInstance,
        nodeInstance: this,
        context: this.context,
        contextNode: this.contextNode,
        contextEdge: this.contextEdge,
        behaviorDef,
        behaviorBase,
      });
      return {
        behaviorDef,
        behaviorBase,
        behaviorBean,
      };
    }

    async _saveNodeVars() {
      if (!this.contextNode._nodeVars._dirty) return;
      // flowNode
      this.contextNode._flowNode.nodeVars = JSON.stringify(this.contextNode._nodeVars._vars);
      // modelFlowNode maybe deleted when flowNodeStatus=1
      if (this.contextNode._flowNodeHistory.flowNodeStatus === 0) {
        await this.modelFlowNode.update(this.contextNode._flowNode);
      }
      // flowNode history
      this.contextNode._flowNodeHistory.nodeVars = this.contextNode._flowNode.nodeVars;
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
      // done
      this.contextNode._nodeVars._dirty = false;
    }

    async _saveVars() {
      // save nodeVars
      await this._saveNodeVars();
      // save flowVars
      await this.flowInstance._saveFlowVars();
    }

    async _setCurrent(clear) {
      // flow
      this.context._flow.flowNodeIdCurrent = clear ? 0 : this.contextNode._flowNodeId;
      this.context._flow.flowNodeNameCurrent = clear ? '' : this.contextNode._nodeDef.name;
      await this.modelFlow.update(this.context._flow);
      // flow history
      this.context._flowHistory.flowNodeIdCurrent = this.context._flow.flowNodeIdCurrent;
      this.context._flowHistory.flowNodeNameCurrent = this.context._flow.flowNodeNameCurrent;
      await this.modelFlowHistory.update(this.context._flowHistory);
    }

    async _clear(options) {
      options = options || {};
      let flowNodeRemark;
      let timeDone;
      const flowNodeHandleStatus = options.flowNodeHandleStatus || 0;
      if (flowNodeHandleStatus > 0) {
        flowNodeRemark = options.flowNodeRemark || null;
        timeDone = new Date();
        // clear the current node
        await this._setCurrent(true);
      } else {
        flowNodeRemark = null;
        timeDone = null;
      }
      // delete node
      this.contextNode._flowNode.flowNodeStatus = 1;
      this.contextNode._flowNode.flowNodeHandleStatus = flowNodeHandleStatus;
      this.contextNode._flowNode.flowNodeRemark = flowNodeRemark;
      this.contextNode._flowNode.timeDone = timeDone;
      await this.modelFlowNode.delete({ id: this.contextNode._flowNodeId });
      // set nodeHistoryStatus
      this.contextNode._flowNodeHistory.flowNodeStatus = 1;
      this.contextNode._flowNodeHistory.flowNodeHandleStatus = flowNodeHandleStatus;
      this.contextNode._flowNodeHistory.flowNodeRemark = flowNodeRemark;
      this.contextNode._flowNodeHistory.timeDone = timeDone;
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
      // ok
      return true;
    }

    _getNodeDefOptionsTask() {
      // nodeDef
      const nodeDef = this.contextNode._nodeDef;
      // options
      const options = this.getNodeDefOptions();
      return nodeDef.type.indexOf('startEventAtom') > -1 ? options.task : options;
    }

    async _getFieldsRight() {
      // options
      const options = this._getNodeDefOptionsTask();
      return options.fieldsRight;
    }

    async _findFlowNodeHistoryPrevious() {
      // flowNodeId
      const flowNodeId = this.contextNode._flowNodeId;
      return await this.flowInstance._findFlowNodeHistoryPrevious({
        flowNodeId,
        cb: ({ /* flowNode*/ nodeDef }) => {
          return nodeDef.type.indexOf('startEventAtom') > -1 || nodeDef.type.indexOf('activityUserTask') > -1;
        },
      });
    }

    async _loadNodeInstancePrevious() {
      const flowNode = await this._findFlowNodeHistoryPrevious();
      const flowNodeInstance = await this.flowInstance._loadNodeInstance({ flowNode, history: true });
      return flowNodeInstance;
    }

    get nodeBaseBean() {
      if (!this._nodeBaseBean) {
        this._nodeBaseBean = ctx.bean._newBean(this.nodeBase.beanFullName, {
          flowInstance: this.flowInstance,
          nodeInstance: this,
          context: this.context,
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
        });
      }
      return this._nodeBaseBean;
    }

    get nodeBase() {
      if (!this._nodeBase) {
        this._nodeBase = ctx.bean.flowDef._getFlowNodeBase(this.contextNode._nodeDef.type);
        if (!this._nodeBase) throw new Error(`flow node not found: ${this.contextNode._nodeDef.type}`);
      }
      return this._nodeBase;
    }
  }
  return FlowNode;
};
