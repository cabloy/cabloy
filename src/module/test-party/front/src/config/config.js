import configPartyRenderList from './config/configPartyRenderList.js';
import configPartyRenderItem from './config/configPartyRenderItem.js';

export default {
  message: 'Hello World',
  markCount: 2,
  monkeyed: false,
  atoms: {
    party: {
      render: {
        list: configPartyRenderList,
        item: configPartyRenderItem,
      },
    },
  },
};
