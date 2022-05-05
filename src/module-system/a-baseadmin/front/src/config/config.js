// user
import configUserRenderItem from './config/user/configRenderItem.js';
import configUserRenderList from './config/user/configRenderList.js';
export default {
  role: {
    select: {
      maxLevelAutoOpened: 2,
    },
  },
  atoms: {
    user: {
      render: {
        item: configUserRenderItem,
        list: configUserRenderList,
      },
    },
  },
};
