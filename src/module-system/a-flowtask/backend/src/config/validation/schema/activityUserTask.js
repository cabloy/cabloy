module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // activityUserTask
  schemas.activityUserTask = {
    type: 'object',
    properties: {
      assignees: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Assignees',
        notEmpty: true,
      },
      showAssignees: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Show Assignees',
      },
      confirmation: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Confirmation Assignees',
      },
      confirmationAllowAppend: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'ConfirmationAllowAppend',
      },
      bidding: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Bidding',
      },
      completionCondition: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Completion Condition',
        notEmpty: true,
      },
      rejectedNode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Rejected Node',
      },
      allowPassTask: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Pass Task',
      },
      allowRejectTask: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Reject Task',
      },
      allowCancelFlow: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Cancel Flow',
      },
      allowRecall: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Recall',
      },
      schema: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Schema',
        notEmpty: true,
        ebParams: {
          actionSave: false,
          actionDone: true,
          actions: [{
            name: 'schemaReference',
            actionModule: 'a-flowchart',
            actionComponent: 'actionUserTask',
            icon: { material: 'info' },
            navigateOptions: { target: '_self' },
          }],
        },
      },
    },
  };
  return schemas;
};
