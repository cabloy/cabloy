import configFlowTaskActions from './config/configFlowTaskActions.js';
import configFlowTaskRenderList from './config/configFlowTaskRenderList.js';
import configFlowTaskRenderAtom from './config/configFlowTaskRenderAtom.js';
import configFlowRenderList from './config/configFlowRenderList.js';
import configFlowRenderItem from './config/configFlowRenderItem.js';

export default {
  flowTask: {
    actions: configFlowTaskActions,
    render: {
      list: configFlowTaskRenderList,
      atom: configFlowTaskRenderAtom,
    },
  },
  flow: {
    render: {
      list: configFlowRenderList,
      item: configFlowRenderItem,
    },
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
  flowHandleStatuses: {
    1: {
      color: 'teal',
      text: 'End',
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
