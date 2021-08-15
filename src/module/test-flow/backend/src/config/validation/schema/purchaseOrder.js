module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // purchase order
  const __display = {
    expression: '!!_flowDefKey',
    dependencies: ['_flowDefKey'],
    // host: {
    //   stage: 'draft', // draft/formal/history
    //   mode: 'edit', // view
    // },
  };
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
        notEmpty: true,
      },
      // Stats
      __groupStats: {
        ebType: 'group-flatten',
        ebTitle: 'Details Stats',
      },
      detailsCount: {
        type: 'number',
        ebType: 'detailsStat',
        ebTitle: 'Quantity',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
          expression: 'details.length',
        },
        ebReadOnly: true,
      },
      detailsAmount: {
        type: 'number',
        ebType: 'detailsStat',
        ebTitle: 'Amount',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
          expression: 'details.reduce(function(a,b){return a+b.amount;},0)',
        },
        ebAutoSubmit: true,
        ebCurrency: true,
        ebReadOnly: true,
      },
      // Details
      __groupDetails: {
        ebType: 'group-flatten',
        ebTitle: 'Details',
        ebGroupWhole: true,
        ebParams: {
          titleHidden: true,
        },
      },
      details: {
        ebType: 'details',
        ebTitle: 'Details',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
        },
        ebDisplay: __display,
      },
      // __groupDetails2: {
      //   ebType: 'group-flatten',
      //   ebTitle: 'Details',
      //   ebGroupWhole: true,
      //   ebParams: {
      //     titleHidden: true,
      //   },
      // },
      // details_2: {
      //   ebType: 'details',
      //   ebTitle: 'Details 2',
      //   ebParams: {
      //     detailClass: {
      //       module: moduleInfo.relativeName,
      //       detailClassName: 'default',
      //     },
      //   },
      // },
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
