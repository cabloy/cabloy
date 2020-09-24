class Listener {
  constructor(context) {
    this.context = context;
  }


  async onFlowStart(options) {
    console.log('onFlowStart:', options.startEventId);
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

  // async execute() {
  //   // const { name, node, edge, flow } = context;
  //   return this.context._flowDefKey;
  // }
}
module.exports = app => {
  const definition = {
    info: {
      title: 'Test_Set00_Simple',
      description: 'Test_Set00_Simple',
      version: '2020-09-23 8',
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
