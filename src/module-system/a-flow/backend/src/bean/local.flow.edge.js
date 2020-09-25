module.exports = ctx => {
  class FlowEdge {
    constructor({ flowInstance, context, edgeRef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this._edgeRef = edgeRef;
      this._edgeBase = null;
      this._edgeBaseBean = null;
    }

    async init() {
      // donothing
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
      await this.flowInstance.nextNode({ edgeRef: this._edgeRef });
    }

    get edgeBaseBean() {
      if (!this._edgeBaseBean) {
        this._edgeBaseBean = ctx.bean._newBean(this.edgeBase.beanFullName, {
          flowInstance: this.flowInstance, context: this.context, edgeRef: this._edgeRef,
        });
      }
      return this._edgeBaseBean;
    }

    get edgeBase() {
      if (!this._edgeBase) this._edgeBase = ctx.bean.flowDef._getFlowEdgeBase(this._edgeRef.type);
      return this._edgeBase;
    }

  }
  return FlowEdge;
};
