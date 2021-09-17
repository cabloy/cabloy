import configPostRenderList from './config/configPostRenderList.js';
import configPostRenderItem from './config/configPostRenderItem.js';

export default {
  atoms: {
    post: {
      render: {
        list: configPostRenderList,
        // item: configPostRenderItem,
      },
    },
  },
};
