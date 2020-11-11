module.exports = app => {
  const schemas = {};
  // purchase order
  schemas.purchaseOrder = {
    type: 'object',
    meta: {
      custom: {
        // component: 'purchaseOrderItem',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      flowDefKey: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Flow Definition',
        ebOptionsBlankAuto: true,
        ebOptions: [
          { title: 'Test_Set01_StartEvent_Atom', value: 'set01_startEventAtom' },
          { title: 'Test_Set01_Atom_UserTask', value: 'set01_atomUserTask' },
          { title: 'Test_Set01_Atom_AssigneesConfirmation', value: 'set01_atomAssigneesConfirmation' },
        ],
      },
    },
  };
  // purchase order search
  schemas.purchaseOrderSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
