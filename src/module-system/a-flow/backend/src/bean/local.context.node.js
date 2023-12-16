module.exports = class ContextNode {
  // contextEdge maybe null
  constructor({ context, contextEdge, nodeDef }) {
    this.context = context;
    this.contextEdge = contextEdge;
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
};
