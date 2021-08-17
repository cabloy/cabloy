import ActionBase from '../../common/actionBase.js';
import ActionBulkDelete from './actionBulk/actionBulkDelete.js';
import ActionBulkExport from './actionBulk/actionBulkExport.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionBase, //
    ActionBulkDelete,
    ActionBulkExport,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'deleteBulk') {
        return await this._onActionBulkDelete();
      } else if (this.action.name === 'exportBulk') {
        return await this._onActionBulkExport();
      }
    },
  },
};
