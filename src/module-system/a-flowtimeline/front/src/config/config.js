import configFlowTaskActions from './config/configFlowTaskActions.js';

export default {
  flowTask: {
    actions: configFlowTaskActions,
  },
  flowTaskHandleStatuses: {
    1: {
      color: 'teal',
      text: 'Passed',
    },
    2: {
      color: 'gray',
      text: 'Rejected',
    },
    3: {
      color: 'gray',
      text: 'Cancelled',
    },
    4: {
      color: 'teal',
      text: 'FlowTaskHandleStatusForwarded',
    },
    5: {
      color: 'teal',
      text: 'FlowTaskHandleStatusSubstituted',
    },
  },
  flowNodeHandleStatuses: {
    1: {
      color: 'teal',
      text: 'Ended',
    },
    2: {
      color: 'gray',
      text: 'Rejected',
    },
    3: {
      color: 'gray',
      text: 'Cancelled',
    },
  },
  flowHandleStatuses: {
    1: {
      color: 'teal',
      text: 'Ended',
    },
    2: {
      color: 'gray',
      text: 'Rejected',
    },
    3: {
      color: 'gray',
      text: 'Cancelled',
    },
  },
};
