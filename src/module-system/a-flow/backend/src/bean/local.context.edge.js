module.exports = ctx => {

  class ContextEdge {

    constructor({ context, contextNode, edgeRef }) {
      this.context = context;
      this.contextNode = contextNode;
      this._edgeRef = edgeRef;
      //
      this._utils = null;
    }

    get utils() {
      return this._utils;
    }

  }

  return ContextEdge;
};
