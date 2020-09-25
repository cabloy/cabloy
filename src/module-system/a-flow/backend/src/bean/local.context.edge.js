module.exports = ctx => {

  class ContextEdge {

    constructor({ edgeRef }) {
      this._edgeRef = edgeRef;
    }

  }

  return ContextEdge;
};
