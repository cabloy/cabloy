const Listener = require('./listener/set00_simple.spec.js');

module.exports = app => {
  const content = {
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
  const definition = {
    atomName: 'Test_Set00_Simple',
    atomStaticKey: 'set00_simple',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};
