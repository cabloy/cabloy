const require3 = require('require3');
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeRef.id === 'startEvent_1') {
      const flowDefKey = this.context.atom.flowDefKey;
      assert.equal(flowDefKey, 'set01_startEventAtom');
    }
  }

};
