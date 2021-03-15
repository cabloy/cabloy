module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // purchase order
  schemas.purchaseOrder = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
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
      // Work Flow
      __groupWorkFlow: {
        ebType: 'group-flatten',
        ebTitle: 'WorkFlow',
      },
      _flowDefKey: {
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
      // Details
      __groupDetails: {
        ebType: 'group-flatten',
        ebTitle: 'Details',
        ebGroupWhole: true,
      },
      details: {
        ebType: 'details',
        ebOptions: {
        },
      },
      __groupDetails2: {
        ebType: 'group-flatten',
        ebTitle: 'Details 2',
        ebGroupWhole: true,
      },
      details_2: {
        ebType: 'details',
        ebOptions: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
        },
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
