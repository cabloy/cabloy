module.exports = ctx => {

  class ContextNode {

    constructor({ context, nodeRef }) {
      this.context = context;
      this._nodeRef = nodeRef;
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
