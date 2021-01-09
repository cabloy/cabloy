const require3 = require('require3');
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onFlowStart(options) {
    console.log('onFlowStart: ', options.startEventId);
    // flowVars
    const xyz = this.context.vars.get('x.y.z');
    assert.equal(xyz, undefined);
    this.context.vars.set('x.y.z', 'flow');
  }

  async onFlowEnd(options) {
    console.log('onFlowEnd: ', options && options.flowRemark);
    // flowVars
    const xyz = this.context.vars.get('x.y.z');
    assert.equal(xyz, 'flow');
  }

  async onNodeEnter(contextNode) {
    console.log('onNodeEnter: ', contextNode._nodeDef.id);
    // nodeVars
    const xyz = contextNode.vars.get('x.y.z');
    assert.equal(xyz, undefined);
    contextNode.vars.set('x.y.z', contextNode._nodeDef.id);
  }

  async onNodeBegin(contextNode) {
    console.log('onNodeBegin: ', contextNode._nodeDef.id);
  }

  async onNodeDoing(contextNode) {
    console.log('onNodeDoing: ', contextNode._nodeDef.id);
  }

  async onNodeEnd(contextNode) {
    console.log('onNodeEnd: ', contextNode._nodeDef.id);
  }

  async onNodeLeave(contextNode) {
    console.log('onNodeLeave: ', contextNode._nodeDef.id);
    // nodeVars
    const xyz = contextNode.vars.get('x.y.z');
    assert.equal(xyz, contextNode._nodeDef.id);
  }

  async onEdgeEnter(contextEdge, contextNode) {
    console.log('onEdgeEnter: ', contextEdge._edgeDef.id, ' from node: ', contextNode._nodeDef.id);
  }

  async onEdgeTake(contextEdge, contextNode) {
    console.log('onEdgeTake: ', contextEdge._edgeDef.id, ' from node: ', contextNode._nodeDef.id);
  }

  async onEdgeLeave(contextEdge, contextNode) {
    console.log('onEdgeLeave: ', contextEdge._edgeDef.id, ' from node: ', contextNode._nodeDef.id);
  }

  getNodeDefOptions(contextNode /* { options }*/) {
    console.log('getNodeDefOptions: ', contextNode._nodeDef.id);
  }

};
