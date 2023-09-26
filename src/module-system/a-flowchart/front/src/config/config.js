const __listenerDefault = `class Listener {
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
`;

export default {
  flowDef: {
    default: {
      listener: __listenerDefault,
      process: {
        nodes: [],
        edges: [],
      },
    },
    groups: [
      { name: 'atom', title: 'Atom' },
      { name: 'startEvent', title: 'Start Event' },
      { name: 'endEvent', title: 'End Event' },
      { name: 'gateway', title: 'Gateway' },
      { name: 'activity', title: 'Activity' },
    ],
  },
  schema: {
    default: {
      base: {
        behavior: {
          id: '',
          name: '',
          type: '',
          color: '',
        },
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
