const require3 = require('require3');
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeRef.id === 'startEvent_1') {
      const _flowDefKey = this.context.atom._flowDefKey;
      assert.equal(_flowDefKey, 'set01_atomUserTask');
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

  async getSchemaWrite(contextTask, contextNode/* { schemaBase, schemaWrite }*/) {
    console.log('getSchemaWrite: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeRef.id);
  }

  getNodeRefOptions(contextNode /* { options }*/) {
    console.log('getNodeRefOptions: ', contextNode._nodeRef.id);
  }

};
