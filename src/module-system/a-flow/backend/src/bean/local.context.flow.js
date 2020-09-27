module.exports = ctx => {

  class ContextFlow {

    constructor({ flowDef }) {
      this._flowDef = flowDef;
      this._flowDefContent = JSON.parse(this._flowDef.content);
      //
      this._flowId = null;
      this._flow = null;
      this._flowHistory = null;
      this._flowVars = null;
      //
      this._utils = null;
    }

    get vars() {
      return this._flowVars;
    }

    get utils() {
      return this._utils;
    }

  }

  return ContextFlow;
};
