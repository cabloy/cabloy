class Listener {
  constructor(context) {
    this.context = context;
  }


  async onFlowStart(options) {
    console.log('onFlowStart:', options.startEventId);
    // let xyz = this.context.flowVars.get('x.y.z');
    // console.log('--xyz:', xyz);
    // this.context.flowVars.set('x.y.z', true);
    // xyz = this.context.flowVars.get('x.y.z');
    // console.log('--xyz:', xyz);
  }

  async onFlowEnd() {
    console.log('onFlowEnd');
  }

  async onNodeEnter() {
    console.log('onNodeEnter');
  }

  async onNodeBegin() {
    console.log('onNodeBegin');
  }

  async onNodeDoing() {
    console.log('onNodeDoing');
  }

  async onNodeEnd() {
    console.log('onNodeEnd');
  }

  async onNodeLeave() {
    console.log('onNodeLeave');
  }

  async onEdgeEnter() {
    console.log('onEdgeEnter');
  }

  async onEdgeTake() {
    console.log('onEdgeTake');
  }

  async onEdgeLeave() {
    console.log('onEdgeLeave');
  }

}
module.exports = app => {
  const definition = {
    info: {
      title: 'Test_Set00_Simple',
      description: 'Test_Set00_Simple',
      version: '2020-09-23 13',
    },
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
    listener: Listener.toString(),
  };
  return definition;
};
