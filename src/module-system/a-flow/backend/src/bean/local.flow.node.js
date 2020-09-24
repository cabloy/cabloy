module.exports = ctx => {
  class FlowNode {
    constructor({ flowInstance, context, nodeRef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this._nodeRef = nodeRef;
      this._nodeBase = null;
      this._nodeBaseBean = null;
    }

    async enter() {
      // raise event: onNodeEnter
      const res = await this.nodeBaseBean.onNodeEnter();
      if (!res) return;
      await this.begin();
    }

    async begin() {
      // raise event: onNodeBegin
      const res = await this.nodeBaseBean.onNodeBegin();
      if (!res) return;
      await this.doing();
    }

    async doing() {
      // raise event: onNodeDoing
      const res = await this.nodeBaseBean.onNodeDoing();
      if (!res) return;
      await this.end();
    }

    async end() {
      // raise event: onNodeEnd
      const res = await this.nodeBaseBean.onNodeEnd();
      if (!res) return;
      await this.leave();
    }

    async leave() {
      // raise event: onNodeLeave
      const res = await this.nodeBaseBean.onNodeLeave();
      if (!res) return;
      // next
      await this.flowInstance.nextEdges({ nodeRef: this._nodeRef });
    }

    get nodeBaseBean() {
      if (!this._nodeBaseBean) {
        this._nodeBaseBean = ctx.bean._newBean(this.nodeBase.beanFullName, {
          flowInstance: this.flowInstance, context: this.context, nodeRef: this._nodeRef,
        });
      }
      return this._nodeBaseBean;
    }

    get nodeBase() {
      if (!this._nodeBase) this._nodeBase = ctx.bean.flowDef._getFlowNodeBase(this._nodeRef.type);
      return this._nodeBase;
    }

  }
  return FlowNode;
};
