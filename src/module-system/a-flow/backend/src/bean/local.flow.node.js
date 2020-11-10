const VarsFn = require('../common/vars.js');
const UtilsFn = require('../common/utils.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode {
    constructor({ flowInstance, context, nodeRef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this._nodeBase = null;
      this._nodeBaseBean = null;
      // context
      this.contextNode = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.node`, {
        context, nodeRef,
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

    async init({ flowNodeIdPrev }) {
      // create flowNode
      const flowNodeId = await this._createFlowNode({ flowNodeIdPrev });
      // context init
      await this._contextInit({ flowNodeId });
    }

    async _load({ flowNode }) {
      // context init
      await this._contextInit({ flowNodeId: flowNode.id });
    }

    async _createFlowNode({ flowNodeIdPrev = 0 }) {
      // flowNode
      const data = {
        flowId: this.context._flowId,
        flowNodeDefId: this.contextNode._nodeRef.id,
        flowNodeName: this.contextNode._nodeRef.name,
        flowNodeIdPrev,
        nodeVars: '{}',
      };
      const res = await this.modelFlowNode.insert(data);
      const flowNodeId = res.insertId;
      // flowNodeHistory
      data.flowNodeId = flowNodeId;
      await this.modelFlowNodeHistory.insert(data);
      // ok
      return flowNodeId;
    }

    async _contextInit({ flowNodeId }) {
      // flowNodeId
      this.contextNode._flowNodeId = flowNodeId;
      // flowNode
      this.contextNode._flowNode = await this.modelFlowNode.get({ id: flowNodeId });
      this.contextNode._flowNodeHistory = await this.modelFlowNodeHistory.get({ flowNodeId });
      // nodeVars
      this.contextNode._nodeVars = new (VarsFn())();
      this.contextNode._nodeVars._vars = this.contextNode._flowNode.nodeVars ? JSON.parse(this.contextNode._flowNode.nodeVars) : {};
      // utils
      this.contextNode._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
      });
    }

    async _saveNodeVars() {
      if (!this.contextNode._nodeVars._dirty) return;
      // flowNode
      this.contextNode._flowNode.nodeVars = JSON.stringify(this.contextNode._nodeVars._vars);
      await this.modelFlowNode.update(this.contextNode._flowNode);
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
      this.context._flow.flowNodeNameCurrent = clear ? '' : this.contextNode._nodeRef.name;
      await this.modelFlow.update(this.context._flow);
      // flow history
      this.context._flowHistory.flowNodeIdCurrent = this.context._flow.flowNodeIdCurrent;
      this.context._flowHistory.flowNodeNameCurrent = this.context._flow.flowNodeNameCurrent;
      await this.modelFlowHistory.update(this.context._flowHistory);
    }

    async _clearCurrent() {
      // clear
      await this._setCurrent(true);
      // clear node
      await this.modelFlowNode.delete({ id: this.contextNode._flowNodeId });
      // set nodeHistoryStatus
      this.contextNode._flowNodeHistory.flowNodeStatus = 1;
      this.contextNode._flowNodeHistory.flowNodeRemark = null;
      this.contextNode._flowNodeHistory.timeDone = new Date();
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
    }

    getNodeRefOptions() {
      return this.nodeBaseBean.getNodeRefOptions();
    }

    async enter() {
      // current
      await this._setCurrent();
      // raise event: onNodeEnter
      const res = await this.nodeBaseBean.onNodeEnter();
      await this._saveVars();
      if (!res) return false;
      return await this.begin();
    }

    async begin() {
      // raise event: onNodeBegin
      const res = await this.nodeBaseBean.onNodeBegin();
      await this._saveVars();
      if (!res) return false;
      return await this.doing();
    }

    async doing() {
      // raise event: onNodeDoing
      const res = await this.nodeBaseBean.onNodeDoing();
      await this._saveVars();
      if (!res) return false;
      return await this.end();
    }

    async end() {
      // raise event: onNodeEnd
      const res = await this.nodeBaseBean.onNodeEnd();
      await this._saveVars();
      if (!res) return false;
      return await this.leave();
    }

    async leave() {
      // raise event: onNodeLeave
      const res = await this.nodeBaseBean.onNodeLeave();
      await this._saveVars();
      // clear current
      await this._clearCurrent();
      // res
      if (!res) return false;
      // next
      return await this.flowInstance.nextEdges({ contextNode: this.contextNode });
    }

    get nodeBaseBean() {
      if (!this._nodeBaseBean) {
        this._nodeBaseBean = ctx.bean._newBean(this.nodeBase.beanFullName, {
          flowInstance: this.flowInstance, nodeInstance: this,
          context: this.context, contextNode: this.contextNode,
        });
      }
      return this._nodeBaseBean;
    }

    get nodeBase() {
      if (!this._nodeBase) {
        this._nodeBase = ctx.bean.flowDef._getFlowNodeBase(this.contextNode._nodeRef.type);
        if (!this._nodeBase) throw new Error(`flow node not found: ${this.contextNode._nodeRef.type}`);
      }
      return this._nodeBase;
    }

  }
  return FlowNode;
};
