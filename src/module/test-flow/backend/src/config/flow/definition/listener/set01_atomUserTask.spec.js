const require3 = require('require3');
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeRef.id === 'startEvent_1') {
      const flowDefKey = this.context.atom.flowDefKey;
      assert.equal(flowDefKey, 'set01_atomUserTask');
    }
  }

  async onTaskCreated(contextTask, contextNode) {
    console.log('onTaskCreated: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeRef.id);
  }

  async onTaskClaimed(contextTask, contextNode) {
    console.log('onTaskClaimed: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeRef.id);
  }

  async onTaskCompleted(contextTask, contextNode) {
    console.log('onTaskCompleted: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeRef.id);
    console.log('handleStatus: %d, handleRemark: %s', contextTask._flowTask.handleStatus, contextTask._flowTask.handleRemark);
  }

};
