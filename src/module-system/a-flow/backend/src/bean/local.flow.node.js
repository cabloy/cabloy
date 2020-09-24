module.exports = ctx => {
  class FlowNode {
    constructor({ context, nodeRef }) {
      this.context = context;
      this._nodeRef = nodeRef;
      this._nodeBase = null;
      this._nodeBaseBean = null;
    }


    async onNodeEnter() {
      await this.nodeBaseBean.onNodeEnter();
    }

    get nodeBaseBean() {
      if (!this._nodeBaseBean) {
        this._nodeBaseBean = ctx.bean._newBean(this.nodeBase.beanFullName, {
          context: this, nodeRef: this._nodeRef,
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
