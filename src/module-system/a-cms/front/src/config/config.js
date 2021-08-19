import configArticleRenderList from './config/configArticleRenderList.js';
import configArticleRenderItem from './config/configArticleRenderItem.js';

export default {
  atoms: {
    article: {
      render: {
        list: configArticleRenderList,
        item: configArticleRenderItem,
      },
    },
  },
};
