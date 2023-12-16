module.exports = class ContextEdge {
  constructor({ context, contextNode, edgeDef }) {
    this.context = context;
    this.contextNode = contextNode;
    this._edgeDef = edgeDef;
    //
    this._utils = null;
  }

  get utils() {
    return this._utils;
  }
};
