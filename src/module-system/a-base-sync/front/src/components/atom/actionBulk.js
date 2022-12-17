import ActionBase from '../../common/actionBase.js';
import ActionBulkDelete from './actionBulk/actionBulkDelete.js';
import ActionBulkExport from './actionBulk/actionBulkExport.js';
import ActionBulkImport from './actionBulk/actionBulkImport.js';
import ActionBulkLayout from './actionBulk/actionBulkLayout.js';
import ActionBulkDraftStats from './actionBulk/actionBulkDraftStats.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionBase, //
    ActionBulkDelete,
    ActionBulkExport,
    ActionBulkImport,
    ActionBulkLayout,
    ActionBulkDraftStats,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'deleteBulk') {
        return await this._onActionBulkDelete();
      } else if (this.action.name === 'exportBulk') {
        return await this._onActionBulkExport();
      } else if (this.action.name === 'importBulk') {
        return await this._onActionBulkImport();
      } else if (this.action.name === 'layoutBulk') {
        return await this._onActionBulkLayout();
      } else if (this.action.name === 'draftStatsBulk') {
        return await this._onActionBulkDraftStats();
      }
    },
  },
};
