import configPurchaseOrderRenderList from './config/configPurchaseOrderRenderList.js';
import configDetailDefaultRenderList from './config/configDetailDefaultRenderList.js';

export default {
  atoms: {
    purchaseOrder: {
      render: {
        list: configPurchaseOrderRenderList,
      },
    },
  },
  details: {
    default: {
      render: {
        list: configDetailDefaultRenderList,
      },
    },
  },
};
