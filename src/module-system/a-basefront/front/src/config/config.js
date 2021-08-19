import configAtomRenderList from './config/configAtomRenderList.js';
import configAtomRenderItem from './config/configAtomRenderItem.js';
import configResourceRenderTree from './config/configResourceRenderTree.js';

export default {
  atom: {
    render: {
      list: configAtomRenderList,
      item: configAtomRenderItem,
    },
  },
  resource: {
    render: {
      tree: configResourceRenderTree,
    },
  },
};
