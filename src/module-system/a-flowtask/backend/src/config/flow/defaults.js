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
      confirmation: false,
      confirmationAllowAppend: false,
      bidding: false,
      showBiddings: false,
      completionCondition: {
        passed: 1,
        rejected: '100%',
      },
      rejectedNode: null,
      allowPassTask: true,
      allowRejectTask: false,
      allowCancelFlow: true,
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
    confirmation: false,
    confirmationAllowAppend: false,
    bidding: false,
    showBiddings: false,
    completionCondition: {
      passed: 1,
      rejected: '100%',
    },
    rejectedNode: null,
    allowPassTask: true,
    allowRejectTask: true,
    allowCancelFlow: false,
    schema: {
      read: true,
      write: false,
    },
  },
};
