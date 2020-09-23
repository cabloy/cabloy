class Listener {
  async execute(context) {
    const { name, node, edge, flow } = context;
  }
}
module.exports = app => {
  const definition = {
    info: {
      title: 'Test_Set00_Simple',
      description: 'Test_Set00_Simple',
      version: '2020-09-22',
    },
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEvent',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEvent',
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
