module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const definition = {
    info: {
      title: 'Test_Set00_StartEvent_Timer',
      description: 'Test_Set00_StartEvent_Timer',
      revision: 1,
    },
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventTimer',
          options: {
            repeat: {
              every: 2000,
            },
            bean: {
              module: moduleInfo.relativeName,
              name: 'startEventTimer',
            },
            parameterExpression: '{x:1}',
          },
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
