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
      bidding: false,
      completionCondition: {
        passed: 1,
        rejected: '100%',
      },
      rejectedNode: null,
      allowRejectTask: false,
      allowCancelFlow: true,
    },
  },
  activityUserTask: {
    assignees: {
      users: null,
      roles: null,
      vars: null,
    },
    confirmation: false,
    bidding: false,
    completionCondition: {
      passed: 1,
      rejected: '100%',
    },
    rejectedNode: null,
    allowRejectTask: true,
    allowCancelFlow: false,
  },
};
