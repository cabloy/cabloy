const require3 = require('require3');
const assert = require3('assert');

class Listener {
  constructor(context) {
    this.context = context;
  }

  async onFlowStart(options) {
    console.log('onFlowStart:', options.startEventId);
    // flowVars
    const xyz = this.context.vars.get('x.y.z');
    assert.equal(xyz, undefined);
    this.context.vars.set('x.y.z', 'flow');
  }

  async onFlowEnd() {
    console.log('onFlowEnd');
    // flowVars
    const xyz = this.context.vars.get('x.y.z');
    assert.equal(xyz, 'flow');
  }

  async onNodeEnter(contextNode) {
    console.log('onNodeEnter: ', contextNode._nodeRef.id);
    // nodeVars
    const xyz = contextNode.vars.get('x.y.z');
    assert.equal(xyz, undefined);
    contextNode.vars.set('x.y.z', contextNode._nodeRef.id);
  }

  async onNodeBegin(contextNode) {
    console.log('onNodeBegin: ', contextNode._nodeRef.id);
  }

  async onNodeDoing(contextNode) {
    console.log('onNodeDoing: ', contextNode._nodeRef.id);
  }

  async onNodeEnd(contextNode) {
    console.log('onNodeEnd: ', contextNode._nodeRef.id);
  }

  async onNodeLeave(contextNode) {
    console.log('onNodeLeave: ', contextNode._nodeRef.id);
    // nodeVars
    const xyz = contextNode.vars.get('x.y.z');
    assert.equal(xyz, contextNode._nodeRef.id);
  }

  async onEdgeEnter(contextEdge, contextNode) {
    console.log('onEdgeEnter: ', contextEdge._edgeRef.id, ' from node: ', contextNode._nodeRef.id);
  }

  async onEdgeTake(contextEdge, contextNode) {
    console.log('onEdgeTake: ', contextEdge._edgeRef.id, ' from node: ', contextNode._nodeRef.id);
  }

  async onEdgeLeave(contextEdge, contextNode) {
    console.log('onEdgeLeave: ', contextEdge._edgeRef.id, ' from node: ', contextNode._nodeRef.id);
  }

}
module.exports = app => {
  const definition = {
    info: {
      title: 'Test_Set00_Simple',
      description: 'Test_Set00_Simple',
      version: '2020-09-23 00:00:00',
    },
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  return definition;
};
