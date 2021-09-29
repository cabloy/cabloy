module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // activityUserTask
  schemas.activityUserTask = {
    type: 'object',
    properties: {
      assignees: {
        type: 'object',
        ebType: 'component',
        ebTitle: 'Assignees',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderAssignees',
        },
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
        ebType: 'component',
        ebTitle: 'Rejected Node',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderRejectedNode',
        },
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
      allowForward: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Forward',
      },
      allowSubstitute: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Substitute',
      },
      schema: {
        type: 'object',
        ebType: 'component',
        ebTitle: 'Field Permissions',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderSchemaFields',
        },
        notEmpty: true,
      },
    },
  };
  return schemas;
};
