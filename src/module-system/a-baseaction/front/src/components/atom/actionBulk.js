import Vue from 'vue';
import ActionBulkDelete from './actionBulk/actionBulkDelete.js';
import ActionBulkExport from './actionBulk/actionBulkExport.js';
import ActionBulkImport from './actionBulk/actionBulkImport.js';
import ActionBulkLayout from './actionBulk/actionBulkLayout.js';
import ActionBulkDraftStats from './actionBulk/actionBulkDraftStats.js';
import ActionBulkRead from './actionBulk/actionBulkRead.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionBulkDelete,
    ActionBulkExport,
    ActionBulkImport,
    ActionBulkLayout,
    ActionBulkDraftStats,
    ActionBulkRead,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'deleteBulk') {
        return await this._onActionBulkDelete();
      } else if (actionName === 'exportBulk') {
        return await this._onActionBulkExport();
      } else if (actionName === 'importBulk') {
        return await this._onActionBulkImport();
      } else if (actionName === 'layoutBulk') {
        return await this._onActionBulkLayout();
      } else if (actionName === 'draftStatsBulk') {
        return await this._onActionBulkDraftStats();
      } else if (actionName === 'readBulk') {
        return await this._onActionBulkRead();
      }
      throw new Error(`action handler not found: ${actionName}`);
    },
  },
};
