module.exports = app => {
  const definition = {
    info: {
      title: 'Test_Set00_Activity_None',
      description: 'Test_Set00_Activity_None',
      revision: 1,
    },
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'activity_1',
          name: 'ActivityNone',
          type: 'activityNone',
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
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  return definition;
};
