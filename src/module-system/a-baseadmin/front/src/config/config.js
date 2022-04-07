// role
import configRoleRenderItem from './config/role/configRenderItem.js';
import configRoleRenderList from './config/role/configRenderList.js';
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
    role: {
      render: {
        item: configRoleRenderItem,
        list: configRoleRenderList,
      },
    },
    user: {
      render: {
        item: configUserRenderItem,
        list: configUserRenderList,
      },
    },
  },
};
