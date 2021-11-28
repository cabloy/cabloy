import configDocumentRenderList from './config/configDocumentRenderList.js';
import configDocumentRenderItem from './config/configDocumentRenderItem.js';

export default {
  atoms: {
    document: {
      render: {
        list: configDocumentRenderList,
        item: configDocumentRenderItem,
      },
    },
  },
};
