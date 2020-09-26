const UtilsFn = require('../common/utils.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowEdge {
    constructor({ flowInstance, context, contextNode, edgeRef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this.contextNode = contextNode;
      this._edgeBase = null;
      this._edgeBaseBean = null;
      // context
      this.contextEdge = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.edge`, {
        context, contextNode, edgeRef,
      });
    }

    async init() {
      // context init
      await this._contextInit();
    }

    async _contextInit() {
      // utils
      this.contextEdge._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextEdge: this.contextEdge,
      });
    }

    async enter() {
      // raise event: onEdgeEnter
      const res = await this.edgeBaseBean.onEdgeEnter();
      if (!res) return;
      await this.take();
    }

    async take() {
      // raise event: onEdgeTake
      const res = await this.edgeBaseBean.onEdgeTake();
      if (!res) return;
      await this.leave();
    }

    async leave() {
      // raise event: onEdgeLeave
      const res = await this.edgeBaseBean.onEdgeLeave();
      if (!res) return;
      // next
      await this.flowInstance.nextNode({ contextEdge: this.contextEdge });
    }

    get edgeBaseBean() {
      if (!this._edgeBaseBean) {
        this._edgeBaseBean = ctx.bean._newBean(this.edgeBase.beanFullName, {
          flowInstance: this.flowInstance, edgeInstance: this,
          context: this.context, contextNode: this.contextNode, contextEdge: this.contextEdge,
        });
      }
      return this._edgeBaseBean;
    }

    get edgeBase() {
      if (!this._edgeBase) this._edgeBase = ctx.bean.flowDef._getFlowEdgeBase(this.contextEdge._edgeRef.type);
      return this._edgeBase;
    }

  }
  return FlowEdge;
};
