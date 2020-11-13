const FlowNodeActivityUserTaskBase = require('../common/flowNodeActivityUserTaskBase.js');

module.exports = ctx => {
  class FlowNode extends FlowNodeActivityUserTaskBase(ctx) {
  }

  return FlowNode;
};
