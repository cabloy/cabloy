module.exports = ctx => {

  class ContextFlow {

    constructor({ flowDefKey, flowDef }) {
      this._flowDefKey = flowDefKey;
      this._flowDef = flowDef;
      this._flowDefContent = JSON.parse(this._flowDef.content);
      //
      this._flowId = null;
      this._flow = null;
      this._flowHistory = null;
      this._flowVars = null;
    }

    get flowVars() {
      return this._flowVars;
    }

  }

  return ContextFlow;
};
