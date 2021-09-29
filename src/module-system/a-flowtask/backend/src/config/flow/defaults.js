module.exports = {
  startEventAtom: {
    atom: null,
    conditionExpression: null,
    task: {
      assignees: {
        users: null,
        roles: null,
        vars: 'flowUser',
      },
      showAssignees: false,
      confirmation: false,
      confirmationAllowAppend: false,
      bidding: false,
      completionCondition: {
        passed: 1,
        rejected: '100%',
      },
      rejectedNode: null,
      allowPassTask: true,
      allowRejectTask: false,
      allowCancelFlow: true,
      allowRecall: false,
      allowForward: false,
      allowSubstitute: false,
      schema: {
        read: true,
        write: true,
      },
    },
  },
  activityUserTask: {
    assignees: {
      users: null,
      roles: null,
      vars: null,
    },
    showAssignees: true,
    confirmation: false,
    confirmationAllowAppend: false,
    bidding: false,
    completionCondition: {
      passed: 1,
      rejected: '100%',
    },
    rejectedNode: null,
    allowPassTask: true,
    allowRejectTask: true,
    allowCancelFlow: false,
    allowRecall: true,
    allowForward: false,
    allowSubstitute: false,
    schema: {
      read: true,
      write: false,
    },
  },
};
