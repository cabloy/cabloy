import configMessageRenderGroup from './config/configMessageRenderGroup.js';
import configMessageRenderList from './config/configMessageRenderList.js';

export default {
  notification: {
    closeTimeout: -1,
  },
  message: {
    render: {
      group: configMessageRenderGroup,
      list: configMessageRenderList,
    },
  },
};
