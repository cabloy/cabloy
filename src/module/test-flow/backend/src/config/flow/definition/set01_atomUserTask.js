const Listener = require('./listener/set01_atomUserTask.spec.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: Listener.toString(),
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
            conditionExpression: 'atom._flowDefKey===\'set01_atomUserTask\'',
          },
        },
        {
          id: 'activity_1',
          name: 'Drafting',
          type: 'activityUserTask',
          options: {
            assignees: {
              // users: '1,2',
              // roles: '1,2',
              vars: 'flowUser',
            },
            confirmation: false,
            bidding: false,
            completionCondition: {
              // passed: 1,
              // rejected: '100%',
            },
            // rejectedNode:null,
            // allowRejectTask: true,
            // allowCancelFlow: false,
            schema: {
              write: [
                'atomName',
                {
                  name: 'description',
                  property: {
                    type: 'string',
                    ebType: 'text',
                    ebTitle: 'Description',
                  },
                },
              ],
            },
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
    atomName: 'Test_Set01_Atom_UserTask',
    atomStaticKey: 'set01_atomUserTask',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};
