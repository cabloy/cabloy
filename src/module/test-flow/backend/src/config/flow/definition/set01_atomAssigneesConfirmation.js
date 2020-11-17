module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: null,
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventAtom',
          options: {
            atom: {
              module: moduleInfo.relativeName,
              atomClassName: 'purchaseOrder',
            },
            conditionExpression: 'atom._flowDefKey===\'set01_atomAssigneesConfirmation\'',
          },
        },
        {
          id: 'activity_1',
          name: 'Drafting',
          type: 'activityUserTask',
          options: {
            assignees: {
              roles: 'family',
            },
            confirmation: true,
            bidding: true,
          },
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
  const definition = {
    atomName: 'Test_Set01_Atom_AssigneesConfirmation',
    atomStaticKey: 'set01_atomAssigneesConfirmation',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};
