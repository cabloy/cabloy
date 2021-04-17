class Listener {
  constructor(context) {
    this.context = context;
  }

  async onFlowStart(options) {
  }

  async onFlowEnd(options) {
  }

  async onNodeEnter(contextNode) {
  }

  async onNodeBegin(contextNode) {
  }

  async onNodeDoing(contextNode) {
  }

  async onNodeEnd(contextNode) {
  }

  async onNodeLeave(contextNode) {
  }

  async onEdgeEnter(contextEdge, contextNode) {
  }

  async onEdgeTake(contextEdge, contextNode) {
  }

  async onEdgeLeave(contextEdge, contextNode) {
  }
}

export default {
  flowDef: {
    default: {
      listener: Listener.toString(),
      process: {
        nodes: [],
        edges: [],
      },
    },
    groups: [
      { name: 'startEvent', title: 'Start Event' },
      { name: 'endEvent', title: 'End Event' },
      { name: 'activity', title: 'Activity' },
    ],
  },
  schema: {
    default: {
      base: {
        node: {
          id: '',
          name: '',
          type: '',
        },
        edge: {
          id: '',
          name: '',
          source: '',
          target: '',
        },
      },
    },
  },
};
