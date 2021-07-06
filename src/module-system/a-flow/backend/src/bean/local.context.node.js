module.exports = ctx => {
  class ContextNode {
    constructor({ context, nodeDef }) {
      this.context = context;
      this._nodeDef = nodeDef;
      //
      this._flowNodeId = null;
      this._flowNode = null;
      this._flowNodeHistory = null;
      this._nodeVars = null;
      //
      this._utils = null;
    }

    get vars() {
      return this._nodeVars;
    }

    get utils() {
      return this._utils;
    }
  }

  return ContextNode;
};
