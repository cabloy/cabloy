import configRoleRenderItem from './config/configRoleRenderItem.js';
import configRoleRenderList from './config/configRoleRenderList.js';
export default {
  atoms: {
    role: {
      render: {
        item: configRoleRenderItem,
        list: configRoleRenderList,
      },
    },
  },
};
