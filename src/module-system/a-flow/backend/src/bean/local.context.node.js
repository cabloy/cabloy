module.exports = ctx => {

  class ContextNode {

    constructor({ nodeRef }) {
      this._nodeRef = nodeRef;
      //
      this._flowNodeId = null;
      this._flowNode = null;
      this._flowNodeHistory = null;
      this._nodeVars = null;
    }

    get vars() {
      return this._nodeVars;
    }

  }

  return ContextNode;
};
