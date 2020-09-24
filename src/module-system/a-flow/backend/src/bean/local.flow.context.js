module.exports = ctx => {

  class FlowContext {

    constructor({ flowDefKey, flowDef }) {
      this._flowDefKey = flowDefKey;
      this._flowDef = flowDef;
      this._flowDefContent = JSON.parse(this._flowDef.content);
      //
      this._flowId = null;
      this._flowVars = null;
    }

    get flowVars() {
      return this._flowVars;
    }

  }

  return FlowContext;
};
