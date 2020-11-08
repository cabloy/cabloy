const require3 = require('require3');
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeBegin(contextNode) {
    if (contextNode._nodeRef.id === 'activity_1') {
      this.context.vars.set('echo', 'hello');
    }
  }

  async onNodeDoing(contextNode) {
    if (contextNode._nodeRef.id === 'activity_2') {
      // execute activity service
      const res = await contextNode.utils.executeService({
        bean: {
          module: 'test-flow',
          name: 'test',
        },
        parameter: 'hello world',
      });
      assert.equal(res, 'hello world');
    }
  }

  async onNodeEnd(contextNode) {
    if (contextNode._nodeRef.id === 'activity_1') {
      const echo = contextNode.vars.get('echo');
      assert.equal(echo, 'hello');
    }
  }

};
