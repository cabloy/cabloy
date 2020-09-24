module.exports = ctx => {
  class FlowContext {

    constructor({ flowDefKey, flowDef }) {
      this._flowId = null;
      this._flowDefKey = flowDefKey;
      this._flowDef = flowDef;
      this._flowDefContent = JSON.parse(this._flowDef.content);
    }

  }

  return FlowContext;
};
